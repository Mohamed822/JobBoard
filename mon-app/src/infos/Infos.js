import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table, Button } from 'react-bootstrap';
import config from "../config/config";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SweetAlert from 'react-bootstrap-sweetalert';
import './Infos.css';


function Infos () {

    const url = config.url;
    
    const [allinfos,setAllinfos] = useState(null);
    const [infosID, setinfosID] = useState(null);
    const [showdelete, setshowDelete] = useState(false);
    const dialogMessage = "Are you sure you want to delete this Job information ?";

    useEffect(()=>{
        function getData()
        {
            axios.get(config.url+'infos').then(res=>{
                console.log(res)
                const data = res.data;
                setAllinfos(data.reverse())
            }).catch(err=>{
                console.log(err)
            })
        };
        getData();
    },[]);

  const toastSuccess = (str) => {
    toast.success(str, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }
    const hideDeleteDialog = () => {
        setshowDelete(false);
        setinfosID(null);
      }
    const showDeleteDialog = (job) => {
        setinfosID(job.id);
        setshowDelete(true);
      }
      function deleteJob () {
        axios.delete(`${url}infos/${infosID}`).then(res => {
          if(res.status===200){
            toastSuccess('Good Job ! You just deleted one information ! 😉 ');
            hideDeleteDialog()
          }
          })
      }

return(
    
    <div className="parent">
        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
         <SweetAlert
        danger
        showCancel
        show={showdelete}
        confirmBtnText="Yes"
        cancelBtnBsStyle="light"
        cancelBtnText="No"
        confirmBtnBsStyle="danger"
        title="Are you sure ?"
        onConfirm={deleteJob}
        onCancel={hideDeleteDialog}
        focusCancelBtn
      >
        {dialogMessage}
      </SweetAlert>
    <Table className="table" id="table" responsive striped bordered hover variant="dark">
        <thead>
            <tr>
                <th># id</th>
                <th>ID advertisements</th>
                <th>Company Name</th>
                <th>Applicant Email</th>
                <th>Recruiter Email</th>
                <th>Message</th>
                <th>Date</th>    
                <th>Action</th>    
            </tr>
        </thead>
        <tbody>
        {allinfos && ( allinfos.map(infos => (
                            <tr>
                                <td>{infos.id}</td>
                                <td>{infos.id_Ads}</td>
                                <td>{infos.Company_name}</td>
                                <td>{infos.Applicant_email}</td>
                                <td>{infos.Recruiter_email}</td>
                                <td>{infos.Message}</td>
                                <td>{infos.Date.substring(0, 10)}</td>
                                <td><Button variant="danger" onClick= {() => {showDeleteDialog(infos)} }> Delete</Button></td>
                            </tr>
                        ))
        )}</tbody>
    </Table>
</div>
)

}
export default Infos