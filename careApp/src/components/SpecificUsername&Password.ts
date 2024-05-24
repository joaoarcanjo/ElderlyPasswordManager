import { Platform } from "../assets/json/interfaces"

export const getSpecificUsernameAndPassword = (value: string, jsonData: any): any => {
    let toReturn = null
    jsonData.platforms.map((platform: Platform) =>  {
        if (value.toLocaleLowerCase().includes(platform.platformName.toLocaleLowerCase())) {
            toReturn = platform
        }
    })
    return toReturn
}