// A react function component to render the login page.
import React from "react";
import { useDispatch } from "react-redux";
import { auth, login } from "./auth";
import { galdrClientV1R1 } from "../../api";

function Login(props) {
    const inputRef = React.useRef(null);
    const dispatch = useDispatch();

    const handleSubmit = (event) => {
      event.preventDefault();
      const pat = inputRef.current.value;
      galdrClientV1R1.post('/auth/pat', { token: pat }).then(({ data }) => {
        const userToken = data.token;
        dispatch(auth({ pat }))
        return userToken;
      }).then((userToken) => {
        galdrClientV1R1.get('/user ', { headers: { 'Authorization': userToken } }).then(({ data }) => {
          dispatch(login({ user: { ...data, token: userToken } }));
        })
      }).catch((err) => {
        alert("Login failed");
      })
    };

    return (
        <span>
        <form onSubmit={handleSubmit}>
          <label>
          Personal Access Token:
            <input type="text" ref={inputRef} />
          </label>
          <button type="submit">Login</button>
        </form>
      </span>
    );
}

export default Login;