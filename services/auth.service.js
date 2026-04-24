const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const userRepository = require('../repositories/user.repository');

class AuthService {
  async register(userData) {
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    const verificationToken = crypto.randomBytes(20).toString('hex');

    const user = await userRepository.create({
      ...userData,
      password: hashedPassword,
      verificationToken
    });

    const previewUrl = await this.sendVerificationEmail(user.email, verificationToken);
    return { user, previewUrl };
  }

  async login(email, password) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    if (!user.isVerified) {
      throw new Error('Please verify your email to login');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken(user._id);
    return { user: { id: user._id, name: user.name, email: user.email }, token };
  }

  async verifyEmail(token) {
    const user = await userRepository.findByToken(token);
    if (!user) {
      throw new Error('Invalid or expired verification token');
    }

    await userRepository.update(user._id, {
      isVerified: true,
      verificationToken: null
    });
    return true;
  }

  generateToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
  }

  async sendVerificationEmail(email, token) {
    try {
      // Ethereal email for testing
      const testAccount = await nodemailer.createTestAccount();
      const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });

      const verifyUrl = `http://localhost:5173/verify/${token}`; // Assuming frontend runs on 5173
      const message = {
        from: '"Event Manager" <noreply@eventmanager.com>',
        to: email,
        subject: 'Verify your email',
        text: `Please verify your email by clicking: ${verifyUrl}`,
        html: `<p>Please verify your email by clicking here: <a href="${verifyUrl}">Verify Email</a></p>`,
      };

      const info = await transporter.sendMail(message);
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log('Verification email sent! Preview URL: %s', previewUrl);
      return previewUrl;
    } catch (error) {
      console.error('Error sending email', error);
    }
  }
}

module.exports = new AuthService();
