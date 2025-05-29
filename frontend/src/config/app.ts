type AppConfigType = {
    name: string,
    github: {
        title: string,
        url: string
    },
    author: {
        name: string,
        url: string
    },
}

export const appConfig: AppConfigType = {
    name: import.meta.env.VITE_APP_NAME ?? "Sistemas de Controle",
    github: {
        title: "Sistemas de Controle",
        url: "https://github.com/rodrigomarcolin/malcong-controle",
    },
    author: {
        name: "rodrigomarcolin",
        url: "https://github.com/rodrigomarcolin",
    }
}

export const baseUrl = import.meta.env.VITE_BASE_URL ?? ""
