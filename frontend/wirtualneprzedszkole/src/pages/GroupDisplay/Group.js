import React, { useEffect, useRef, useState } from "react";
import GroupService from './GroupService'
import { useNavigate, useParams } from "react-router-dom";
import "./Group.scss"
import FolderService from '../Folders/FolderService';
import UserService from '../User/UserService';
import ChildrenService from '../Children/ChildrenService';
import { ToastContainer, toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const Group = () => {
    const { t } = useTranslation();
    const navigate = useNavigate()

    const [btnHeight, setBtnHeight] = useState(0);
    const btnRef = useRef(null);
    const [group, setGroup] = useState({
        id: '',
        name: '',
        description: '',
        children: [{
            id: '',
            name: '',
            lastName: ''
        }],
        teachers: [{
            id: '',
            name: '',
            lastName: ''
        }]
    });

    const [subFolders, setSubFolders] = useState([
        {
            id: "",
            name: "",
            path: "",
            className: "",
            fileDataList: [{}],
            childrenFolder: [{}],
            parent: {},
        }
    ])
    let { id } = useParams()

    useEffect(() => {
        const getData = async () => {

            let className = await GroupService.getGroup(id).then(response => {
                let groupData = response.data;
                let children = groupData.children.map(it => { return { id: it.id, name: it.name, lastName: it.lastName } })
                let teachers = groupData.teachers.map(it => { return { id: it.id, name: it.name, lastName: it.lastName } })
                setGroup({ id: groupData.id, name: groupData.name, description: groupData.description, children: children, teachers: teachers })
                return groupData.name
            });

            getFolders(className)

        }
        getData().then(r => console.log(r))
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        setBtnHeight(btnRef.current.clientHeight);
    }, [btnRef]);



    const getFolders = async (className) => {
        FolderService.getClassSubFolders(className).then(response => {
            setSubFolders(response.data)
        })
    }

    const NaviToFolder = (type) => {
        subFolders.forEach((folder) => {
            if (type === "Galeria" && folder.name === "Photos")
                navigate("/Folder/" + folder.name + "/" + folder.id)
            else if (type === "Inne" && folder.name === "Other")
                navigate("/Folder/" + folder.name + "/" + folder.id)
        })
    }

    const deleteTeacherFromGroup = async (teacher) => {
        if (window.confirm("Czy na pewno chcesz usunąć " + teacher.name + " " + teacher.lastName + "z grupy " + group.name)) {
            UserService.deleteTeacherFromClass(teacher.id, id).then((response) => {
                if (response.status !== 200) {
                    toast.error("Wystąpił błąd podczas usuwania użytkownika")
                    throw new Error(response.status);
                }
                else {
                    setGroup({
                        id: group.id, name: group.name, description: group.description, children: group.children,
                        teachers: group.teachers.filter((refreshTeachers) => teacher.id !== refreshTeachers.id)
                    })
                    toast.success("Użytkownik " + teacher.name + " " + teacher.lastName + " został pomyślnie usuniety z grupy")
                }
            })
        }
    }

    const deleteChildFromGroup = async (child) => {
        if (window.confirm("Czy na pewno chcesz usunąć " + child.name + " " + child.lastName + "z grupy " + group.name)) {
            ChildrenService.deleteChildFromClass(child.id).then((response) => {
                if (response.status !== 200) {
                    toast.error("Wystąpił błąd podczas usuwania użytkownika")
                    throw new Error(response.status);
                }
                else {
                    setGroup({
                        id: group.id, name: group.name, description: group.description,
                        children: group.children.filter((refreshChildren) => child.id !== refreshChildren.id),
                        teachers: group.teachers
                    })
                    toast.success("Użytkownik " + child.name + " " + child.lastName + " został pomyślnie usuniety z grupy")
                }
            })
        }
    }

    return (
        <div data-testid="group" className='h-100'>
            <ToastContainer />
            <div className="scrollable-div maxArea" style={{ height: `calc(100% - ${btnHeight}px)` }}>
                <table className="content-table w-100">

                    <thead>
                        <tr className='table-head'>
                            <td>{group.name}</td>
                            <td>{t('name')}</td>
                            <td>{t('last_name')}</td>
                            <td>{t('remove_from_group')}</td>
                        </tr>
                    </thead>
                    <tbody className='body'>
                        {group.teachers.map(teacher => (
                            <tr className="teacher" key={teacher.id}>
                                <td>{t('teacher')}</td>
                                <td>{teacher.name}</td>
                                <td>{teacher.lastName}</td>
                                <td>
                                    <button onClick={() => deleteTeacherFromGroup(teacher)} className="btn btn-danger">{t('delete')}</button>
                                </td>
                            </tr>
                        ))
                        }
                        {group.children.map(child => (
                            <tr key={child.id}>
                                <td>{t('kid')}</td>
                                <td>{child.name}</td>
                                <td>{child.lastName}</td>
                                <td>
                                    <button onClick={() => deleteChildFromGroup(child)} className="btn btn-danger">{t('delete')}</button>
                                </td>
                            </tr>
                        ))
                        }
                    </tbody>
                </table>
            </div>
            <div className="row pt-4" ref={btnRef}>
                <div className="col-md-6 col-12">
                    <button type="button" class="btn btn-success me-2" onClick={() => NaviToFolder("Galeria")}>{t('galleries')}</button>
                    <button type="button" class="btn btn-warning" onClick={() => NaviToFolder("Inne")}>{t('other_files')}</button>
                </div>
                <div className="col-md-6 col-12 text-end">
                    <button type="button" class="btn btn-primary" onClick={() => navigate("/Assign-teacher/" + id)}>{t('assign_a_tutor')}</button>
                </div>
            </div>
        </div>
    )
}

export default Group
