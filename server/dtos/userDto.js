module.exports = class UserDto {
    constructor(user) {
        this.mail = user.e_mail;
        this.name = user.Name;
        this.id = user.Id;
        this.role = user.role;
    }
}