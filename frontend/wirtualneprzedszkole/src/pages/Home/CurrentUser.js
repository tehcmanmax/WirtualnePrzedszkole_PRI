//add localization

import React, { useEffect, useState } from 'react'
import "./CurrentUser.scss"
import Sidebar from "../../components/sidebar/sidebar";
import Navbar from "../../components/navbar/navbar"
import Popup_user from "./Popup_user";
import "../GroupDisplay/abc.css"
import { useNavigate, useParams } from "react-router-dom";
import CurrentUserService from "./CurrentUserService";
import EditCurrentUser from "./EditCurrentUser";
import "../User/UserInfo.scss";
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import FileService from "../gallery/FileService";
import { useTranslation } from 'react-i18next';
import nophoto from "../../images/nophoto.jpg"



const CurrentUser = () => {
    const [userAvatar, setUserAvatar] = useState(nophoto);
    const [file, setFile] = useState();
    const navigate = useNavigate();
    const { t } = useTranslation();


    const [current_user, setCurrent_User] = useState({
        id: '',
        email: '',
        name: '',
        lastName: '',
        phoneNumber: '',
        address: '',
        role: '',
        opis: '',
        children: [{
            id: '',
            name: '',
            classId: '',
            className: ''
        }],
    });


    let {id} = useParams()

    useEffect(() => {
        const getData = async () => {
            CurrentUserService.getCurrentUser(id).then(response => {
                console.log('Response from main API: ',response)
                let current_userData = response.data;
                let children;
                if (current_userData.children !== undefined)
                    children = current_userData.children.map(it => {return {id: it.id, name: it.name, classId: it.classId, className: it.className}})
                else {
                    children = []
                }
                setCurrent_User({id: current_userData.id, email: current_userData.email, name: current_userData.name, lastName: current_userData.lastName, phoneNumber: current_userData.phoneNumber, address:current_userData.address, role: current_userData.role, children:  children, opis: current_userData.opis})

                if (current_userData.picture !== undefined) {
                    FileService.getFile(-1, current_userData.picture).then(response => {
                        let urlCreator = window.URL || window.webkitURL;
                        setUserAvatar(urlCreator.createObjectURL(response.data))
                    })
                } else {
                    setUserAvatar(nophoto)
                }
            });
        }
        getData()

    }, [id])

    const[buttonPopup_user, setButtonPopup_user] = useState(false);

    const addAvatar = async(formData) => {
        CurrentUserService.addAvatar(formData).then(response => {
            if (response.status !== 200) throw new Error(response.status);
            else
            {
                FileService.getFile(-1, response.data.picture).then(response => {
                    let urlCreator = window.URL || window.webkitURL;
                    setUserAvatar(urlCreator.createObjectURL(response.data))
                })

            }
        })
    }

    const deleteAvatar = async() => {
        CurrentUserService.deleteAvatar().then(response => {
            if (response.status !== 200) throw new Error(response.status);
            else {
                setUserAvatar(nophoto)
            }
        })
    }


    return (

        <div className="home">
            <Sidebar />
            <div className="homeContainer">

                <Navbar />
                <div>
                    <ToastContainer />

                    {/* PAGE TITLE */}
                    <div className='App_card'>
                        <h1>{t('user_data')}</h1>
                    </div>

                    <div className='row'>
                        <div className='col-xl-4 col-md-5 col-lg-5 col-12'>
                            <div className='App_card'>
                                {/* USER IMAGE SECTION BEGINS*/}
                                <div className="img-container text-center mb-4">

                                    <img
                                        src={userAvatar}
                                        alt="Zdjęcie profilowe"
                                        className="rounded-circle mt-5"
                                        width="150px"
                                        onClick={() => {
                                            const input = document.createElement("input");
                                            input.type = "file";
                                            input.accept = "image/*";
                                            input.onchange = (e) => {
                                                setFile(e.target.files[0]);
                                                const formData = new FormData();
                                                formData.append('file', e.target.files[0]);
                                                addAvatar(formData);
                                            };
                                            input.click();
                                        }}
                                        title={t('update_profile_picture')}
                                    />
                                </div>
                                <div className="button-container">
                                    <div className="uploadAvatar">

                                            <div className='d-flex justify-content-between align-items-center mt-4 gap10'>

                                                <button className="btn btn-danger" onClick={() => deleteAvatar()}>{t('delete_profile')}</button>
                                            </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-xl-8 col-md-7 col-lg-7 col-12'>
                            <div className='App_card'>
                                <div className='row mb-2'>
                                    <div className='col-md-3 col-12'>
                                        <label className="fw-bold">{t('name')}:</label>
                                    </div>
                                    <div className='col-md-9 col-12'>
                                        <p className="labels mb-0">{current_user.name}</p>
                                    </div>
                                </div>
                                <div className='row mb-2'>
                                    <div className='col-md-3 col-12'>
                                        <label className="fw-bold">{t('last_name')}:</label>
                                    </div>
                                    <div className='col-md-9 col-12'>
                                        <p className="labels mb-0">{current_user.lastName}</p>
                                    </div>
                                </div>
                                <div className='row mb-2'>
                                    <div className='col-md-3 col-12'>
                                        <label className="fw-bold">{t('email')}:</label>
                                    </div>
                                    <div className='col-md-9 col-12'>
                                        <p className="labels mb-0">{current_user.email}</p>
                                    </div>
                                </div>
                                <div className='row mb-2'>
                                    <div className='col-md-3 col-12'>
                                        <label className="fw-bold">{t('telephone')}:</label>
                                    </div>
                                    <div className='col-md-9 col-12'>
                                        <p className="labels mb-0">{current_user.phoneNumber}</p>
                                    </div>
                                </div>
                                <div className='row mb-2'>
                                    <div className='col-md-3 col-12'>
                                        <label className="fw-bold">{t('address')}:</label>
                                    </div>
                                    <div className='col-md-9 col-12'>
                                        <p className="labels mb-0">{current_user.address}</p>
                                    </div>
                                </div>
                                {(current_user.role === "ADMIN" || current_user.role === "TEACHER")  &&   <div className='row mb-2'>
                                    <div className='col-md-3 col-12'>
                                        <label className="fw-bold">{t('role')}:</label>
                                    </div>
                                    <div className='col-md-9 col-12'>
                                        <p className="labels mb-0">{current_user.role}</p>
                                    </div>
                                </div>}
                                <div className='row mb-2'>
                                    <div className='col-md-3 col-12'>
                                        <label className="fw-bold">{t('description')}</label>
                                    </div>
                                    <div className='col-md-9 col-12'>
                                        <p className="labels mb-0">{current_user.opis}</p>
                                    </div>
                                </div>

                                <div className='mt-5 d-flex'>
                                    <button type="button" className='btn btn_global me-3' onClick={() => setButtonPopup_user(true)}>{t('edit_data')}</button>
                                    <button type="button" className='btn btn-info' onClick={() => navigate("restart-password")}>{t('change_password')}</button>
                                </div>
                            </div>
                        </div>
                    </div>



                    <div className="v"> <Popup_user trigger={buttonPopup_user} setTrigger={setButtonPopup_user}>

                        <EditCurrentUser  {...current_user} />

                    </Popup_user></div>



                    <div className='row'>
                        <div className='col-12'>
                            <div className='App_card'>
                                <h1>{t('kids')}</h1>
                            </div>
                        </div>
                    </div>

                    <div className='row'>
                        <div className='col-12'>
                            <div className='App_card'>
                                <table className="children">
                                    <thead>
                                    <tr>
                                        <th>{t('name')}</th>
                                        <th>{t('class_name')}</th>
                                    </tr>
                                    </thead>

                                    <tbody>
                                    {current_user.children.map((child) => (
                                        <tr key={child.id}>

                                            <td id="td--currentuser">{child.name}</td>
                                            <td id="td--currentuser">{child.className}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default CurrentUser;