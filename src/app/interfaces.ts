export interface ConfigurationOptions {
    missingAIVs: number,
    missingBIVs: number
};

//to keep track of all user input
export interface State {
    targetIVs: number[],
    options: ConfigurationOptions
};