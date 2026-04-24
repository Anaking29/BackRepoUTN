const authService = require('../services/auth.service');

exports.register = async (req, res, next) => {
  try {
    const { user, previewUrl } = await authService.register(req.body);
    res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email to verify your account.',
      previewUrl
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.login(email, password);
    res.status(200).json({ success: true, user, token });
  } catch (error) {
    next(error);
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    await authService.verifyEmail(req.params.token);
    res.status(200).json({ success: true, message: 'Email verified successfully. You can now login.' });
  } catch (error) {
    next(error);
  }
};
