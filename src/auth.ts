import { SvelteKitAuth, type SvelteKitAuthConfig } from '@auth/sveltekit';
import GitHub from '@auth/sveltekit/providers/github';
import { env } from '$env/dynamic/private';
import db from '$lib/db';
const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, AUTH_SECRET } = env;

export const { handle, signIn, signOut } = SvelteKitAuth(async (event) => {
	const authOptions: SvelteKitAuthConfig = {
		providers: [
			GitHub({
				clientId: GITHUB_CLIENT_ID,
				clientSecret: GITHUB_CLIENT_SECRET,
				authorization: {
					params: {
						scope: 'read:user user:email'
					}
				}
			})
		],
		secret: AUTH_SECRET,
		trustHost: true,
		events: {
			async signIn(message) {
				const { user, profile } = message;

				try {
					const {
						rows: [existingUser]
					} = await db.query`
  					select * from users where github_id = ${profile.id}
          `;

					console.log('existingUser: ', existingUser);

					if (!existingUser) {
						const {
							rows: [newUser]
						} = await db.query`
				      INSERT INTO users (github_id, github_name, github_email, github_image)
				      VALUES (${profile.id}, ${user.name}, ${user.email}, ${user.image})
				      RETURNING *;
				    `;

						console.log('Added newUser: ', newUser);
					} else {
						console.log('Existing user signed in');
						// Perform any actions for returning users
					}
				} catch (err) {
					console.error('error signing in with github: ', err);
				}
			}
		},
		callbacks: {
			redirect() {
				return '/exex';
			},
			jwt({ token, account, profile }) {
				if (account && profile) {
					token.githubId = profile.id;
				}
				return token;
			},
			session({ session, token }) {
				if (session.user) {
					session.user.githubId = token.githubId;
				}
				return session;
			}
		}
	};
	return authOptions;
});
