module.exports = class UserDto {
    mail;
    name;
    id;
    is_admin;

    constructor(user) {
        this.mail = user.mail;
        this.name = user.name;
        this.id = user.id;
        this.is_admin = user.is_admin;
    }
}