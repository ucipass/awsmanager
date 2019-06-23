export function readFile(file) {
    return new Promise((resolve, reject) => {
        if (file) {
            var reader = new FileReader();
            reader.readAsText(file, "UTF-8");
            reader.onload = (evt) =>{
                resolve(evt.target.result)
            }
            reader.onerror = () => {
                reject(false)
            }
        }  
    });
}

