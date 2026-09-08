import * as authService from '../services/authService.js';

async function doctorRegister(req, res, next) {
  try {
    const { D_ID } = await authService.registerDoctor(req.body);
    return res.status(201).json({
      success: true,
      message: 'Doctor registered successfully',
      data: { D_ID },
    });
  } catch (err) {
    next(err);
  }
}

async function patientRegister(req, res, next) {
  try {
    const { P_ID } = await authService.registerPatient(req.body);
    return res.status(201).json({
      success: true,
      message: 'Patient registered successfully',
      data: { P_ID },
    });
  } catch (err) {
    next(err);
  }
}

async function doctorLogin(req, res, next) {
  try {
    const result = await authService.loginDoctor(req.body);

    if (!result) {
      return res.status(401).json({
        success: false,
        message: 'Invalid D_ID or password',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Doctor login successful',
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

async function patientLogin(req, res, next) {
  try {
    const result = await authService.loginPatient(req.body);

    if (!result) {
      return res.status(401).json({
        success: false,
        message: 'Invalid P_ID or password',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Patient login successful',
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

async function getMe(req, res, next) {
  try {
    const user = await authService.getCurrentUser(req.user.id, req.user.role);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (err) {
    next(err);
  }
}

async function logout(req, res) {
  // No server-side session/blacklist by design (see spec). The frontend
  // is responsible for clearing the Firebase token it holds.
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
}

export default {
  doctorRegister,
  patientRegister,
  doctorLogin,
  patientLogin,
  getMe,
  logout,
};