export const permissionTypes = {
    none:-1,
    secretary: 0,
    teacher: 1,
    admin: 2,
    _super: 4,
    system: 3
}

export const permissionNames = {
    [permissionTypes.secretary]: "团支书",
    [permissionTypes.teacher]: "教师",
    [permissionTypes.admin]: "管理员",
    [permissionTypes.system]: "系统",
    [permissionTypes._super]: "超管",
}