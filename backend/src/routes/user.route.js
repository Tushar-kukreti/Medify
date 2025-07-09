import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { upload } from '../middlewares/multer.middleware.js'
import { changePassword, filterDoctors, getCurrentUser, listDoctors, logInUser, logOutUser, refreshAccessToken, registerUser, searchDoctor, updateAvatarAndCover, updateDetails } from '../controllers/user.controller.js'
import { createTimeSlot, deleteTimeSlot, getTimeSlots } from '../controllers/timeslots.controller.js';
import { cancelAppointment, createAppointment, getAllAppointments } from '../controllers/appointment.controller.js';

const router = Router();

router.route('/register').post(upload.fields(
    [
        {
            name: "avatar",
            maxCount: 1,
        },
        {
            name:"cover",
            maxCount: 1,
        },
        {
            name:"certificate",
            maxCount: 10,
        }
    ]
), registerUser);

router.route('/login').post( logInUser );
router.route('/logout').post( verifyJWT, logOutUser );
router.route('/currentUser').get( verifyJWT, getCurrentUser );
router.route('/changePassword').patch( verifyJWT, changePassword );
router.route('/update').patch( verifyJWT, updateDetails );
router.route('/update-photos').patch( verifyJWT, upload.fields(
    [
        {
            name: "avatar",
            maxCount: 1,
        },
        {
            name:"cover",
            maxCount: 1,
        }
    ]), updateAvatarAndCover );
router.route('/refreshAccessToken').post(refreshAccessToken)
router.route('/create-timeslot').post(verifyJWT, createTimeSlot);
router.route('/getTimeSlots').get(verifyJWT, getTimeSlots);
router.route('/deleteTimeSlot').get(verifyJWT, deleteTimeSlot);
router.route('/bookAppointment').post(verifyJWT, createAppointment);
router.route('/checkAppointments').get(verifyJWT, getAllAppointments);
router.route('/cancelAppointments').patch(verifyJWT, cancelAppointment);
router.route('/listDoctors').get(listDoctors);
router.route('/searchDoctor').get(searchDoctor);
router.route('/filterDoctors').get(filterDoctors);

export default router;