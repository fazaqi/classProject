const INITIAL_STATE = {
  id: "",
  username: "",
  password: "",
  role: "",
  login: false,
  error: "",
  loading: false,
  cart: 0
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        ...action.payload,
        login: true,
        loading: false,
        error: ""
      };
    case "LOGIN_LOADING":
      return { ...state, loading: true, error: "" };
    case "LOGIN_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "RESET_PASS":
      return { ...state, ...action.payload };
    case "TAMBAH_CART":
      return { ...state, cart: action.payload };
    case "LOGOUT":
      return INITIAL_STATE;
    default:
      return state;
  }
};
