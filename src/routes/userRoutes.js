import { addNewUser, deleteUser, getUsers, getUserWithId, updateUser } from "../controllers/userController.js";

const routes = (app) => {
    app.route('/users')
        .get(getUsers)
        .post(addNewUser);

    app.route('/users/:userId')
        .get(getUserWithId)
        .put(updateUser)
        .delete(deleteUser);
}

export default routes;