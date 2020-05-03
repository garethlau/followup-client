module.exports = {
  getJWT: () => {
    const jwtToken = localStorage.getItem("JWT_TOKEN");
    return jwtToken;
  },
  getJWTConfig: () => {
    const jwtToken = localStorage.getItem("JWT_TOKEN");
    const config = {
      headers: {
        Authorization: "Bearer " + jwtToken,
      },
    };
    return config;
  },
  setJWT: (token) => {
    localStorage.setItem("JWT_TOKEN", token);
  },
  searchToJSON: (search) => {
    return JSON.parse(
      '{"' +
        decodeURI(search.substring(1))
          .replace(/"/g, '\\"')
          .replace(/&/g, '","')
          .replace(/=/g, '":"') +
        '"}'
    );
  },
};
