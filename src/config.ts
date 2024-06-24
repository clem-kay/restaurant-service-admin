// src/config.ts (Client-side configuration)
const configEnv = {
    BASE_URL: import.meta.env.VITE_BASE_URL, // vite based env to expose env to client
};
export default configEnv;
