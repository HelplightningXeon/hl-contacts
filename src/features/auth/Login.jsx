// A react function component to render the login page.
import React from "react";
import { auth, login } from "./auth";
import { galdrClientV1R1 } from "../../api";

function Login(props) {
    const inputRef = React.useRef(null);

    const handleSubmit = (event) => {
      event.preventDefault();
      const pat = inputRef.current.value;
      fetch(`https://app-dev.helplightning.net.cn/api/v1r1/auth/pat`, { method: "POST", body: { token: pat } }).then(
        (res) => {
          if (res.ok) {
            const userToken = res.data;
            auth({ userToken, pat })
            return userToken;
          } else {
            alert("Login failed");
          }
        }
      ).then((userToken) => {
        galdrClientV1R1.get('/user ', { headers: { 'Authorization': userToken } }).then(({ data }) => {
          login({ user: data });
        })
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