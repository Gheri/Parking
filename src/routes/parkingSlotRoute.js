import { addNewParking, deleteParking, getParkings, getParkingWithId, updateParking } from "../controllers/parkingSlotController.js";

const routes = (app) => {
    app.route('/parkings')
        .get(getParkings)
        .post(addNewParking);

    app.route('/parkings/:parkingId')
        .get(getParkingWithId)
        .put(updateParking)
        .delete(deleteParking);
}

export default routes;