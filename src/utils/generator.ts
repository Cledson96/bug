export  const randomCode = (size = 8) => {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';

    for (let i = 0; i < size; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
}
