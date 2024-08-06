const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			userToken: JSON.parse(sessionStorage.getItem('userData')) || "",
			posts: undefined
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},
			handleLogin: async (userInfo) => {
				try {
					const res = await fetch(process.env.BACKEND_URL + "/api/login", {
						method: "POST",
						body: JSON.stringify(userInfo),
						headers: {
							"Content-Type": "application/json"
						}
					});
					const data = await res.json();
					if (!res.ok) throw new Error("Invalid credentials");

					// Guardar el token en sessionStorage
					sessionStorage.setItem("userData", JSON.stringify(data));

					setStore({ userToken: data });
					return true;
				} catch (error) {
					console.error("Error logging in:", error);
					return false;
				}
			},
			getPosts: async (token) => {
				try {
					const res = await fetch(process.env.BACKEND_URL + "/api/posts", {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							"Authorization": 'Bearer ' + token
						}
					});
					const data = await res.json();
					if (!res.ok) throw new Error("Invalid credentials");

					console.log(data)
					setStore({ posts: data });
				} catch (error) {
					console.error("Error logging in:", error);
				}
			},
			publish: async (postData, token) => {
				try {
					const res = await fetch(process.env.BACKEND_URL + "/api/posts", {
						method: "POST",
						body: JSON.stringify(postData),
						headers: {
							"Content-Type": "application/json",
							"Authorization": 'Bearer ' + token
						}
					});
					const data = await res.json();
					location.reload()
					console.log(data)
					if (!res.ok) throw new Error("Invalid credentials");
				} catch (error) {
					console.error("Error logging in:", error);
				}
			}
		}
	};
};

export default getState;
