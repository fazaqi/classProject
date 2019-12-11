const INITIAL_STATE = {
  id: "",
  username: "",
  password: "",
  role: "",
  login: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return { ...state, ...action.payload, login: true };
    case "LOGOUT":
      return INITIAL_STATE;
    default:
      return state;
  }
};
