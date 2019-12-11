export const LoginSuccessAction = datauser => {
  return {
    type: "LOGIN_SUCCESS",
    payload: datauser
  };
};

export const LogoutAction = () => {
  return {
    type: "LOGOUT"
  };
};
