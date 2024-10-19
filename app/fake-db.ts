export interface ConfigData {
    delay: number;
    mode: string;
    numberRange: { lowLimit: number, highLimit: number };
    specificNumber: number;
}

const configData: ConfigData = {
    numberRange: {
        highLimit: 10,
        lowLimit: 1
    },
    delay: 2,
    mode: "even",
    specificNumber: 0
};

var configDataPromise = new Promise<ConfigData>((resolve, reject) => {
    setTimeout(() => {
        resolve(configData)
    }, 250);
})

export { configDataPromise };
