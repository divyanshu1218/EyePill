const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails[0].value;
            const isAdminEmail = process.env.ADMIN_EMAIL && email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase();

            // Check if user exists by Google ID
            let user = await User.findOne({ where: { googleId: profile.id } });

            if (user) {
                // Ensure admin role is correct
                if (isAdminEmail && user.role !== 'admin') {
                    user.role = 'admin';
                    await user.save();
                }
                return done(null, user);
            }

            // If not, check if email exists (link Google to existing email account)
            user = await User.findOne({ where: { email } });

            if (user) {
                user.googleId = profile.id;
                if (isAdminEmail) {
                    user.role = 'admin';
                }
                await user.save();
                return done(null, user);
            }

            // Create new user
            const role = isAdminEmail ? 'admin' : 'user';
            user = await User.create({
                username: profile.displayName,
                email: email,
                googleId: profile.id,
                role: role,
                password: null // No password for Google users
            });

            done(null, user);
        } catch (err) {
            done(err, null);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

module.exports = passport;
