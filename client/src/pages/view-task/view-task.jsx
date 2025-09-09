import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/admin-layout';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import baseURL from '../../services/baseURL';
import Loader from '../../components/loader/loader';
import Toster from '../../components/toster/toster';

const ViewTask = () => {
  const { id } = useParams();
  const [task, setTask] = useState([]);
  const [client, setClient] = useState([]);
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [txt, setTxt] = useState("");
  const [showToster, setShowToster] = useState("");


  const getTask = async () => {
    let token = localStorage.getItem("token");
    setLoading(true);
    try {
      let data = await axios.get(`${baseURL}/task/api/get-task/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (data.data.status == "success") {
        setTask(data.data.data);
      }
      setLoading(false);
    } catch (error) {
      setShowToster(true);
      setTxt(error?.response?.data?.message);
      console.log(error);
      setLoading(false);
    }
  }

  const getClient = async () => {
    let token = localStorage.getItem("token");
    setLoading(true);
    try {
      let data = await axios.get(`${baseURL}/client/api/get-client/${task.clientId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (data.data.status == "success") {
        setClient(data.data.data);
      }
      setLoading(false);
    } catch (error) {
      setShowToster(true);
      setTxt(error?.response?.data?.message);
      console.log(error);
      setLoading(false);
    }
  }

  const getUser = async () => {
    let token = localStorage.getItem("token");
    setLoading(true);
    try {
      let data = await axios.get(`${baseURL}/auth/api/get-user/${task.assignedTo}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (data.data.status == "success") {
        setUser(data.data.data);
      }
      setLoading(false);
    } catch (error) {
      setShowToster(true);
      setTxt(error?.response?.data?.message);
      console.log(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    getTask()
  }, [])

  useEffect(() => {
    if (task && task.clientId && task.assignedTo) {
      getClient();
      getUser();
    }
  }, [task])

  return (
    <AdminLayout>
      <div className='w-full pr-10 my-10 max-sm:pr-5'>
        {showToster && <Toster txt={txt} setShow={setShowToster} show={showToster} />}

        {
          loading ? <Loader></Loader> : <><p><span className='text-gray-500'>Tasks /</span> Task Details</p>
            <h2 className='text-3xl font-medium mt-7'>Task Details</h2>
            <p className='text-xsm text-gray-500 mt-2'>View and manage task information</p>
            <div>
              <h3 className='text-lg font-bold mb-5 mt-5'>Task Information</h3>
              <hr className='text-gray-200' />
              <div className='mt-5 flex mb-5 max-sm:flex-col max-sm:gap-5'>
                <div className='w-1/2'>
                  <p className='text-amber-400'>Title</p>
                  <p className='mt-2'>{task?.title}</p>
                </div>
                <div className='flex justify-start flex-col items-start w-1/2'>
                  <p className='text-amber-400'>Description</p>
                  <p className='mt-2'>{task?.description}</p>
                </div>
              </div>
              <hr className='text-gray-200' />
              <div className='mt-5 flex mb-5 max-sm:flex-col max-sm:gap-5'>
                <div className='w-1/2'>
                  <p className='text-amber-400'>Assigned To</p>
                  <p className='mt-2'>{user?.name}</p>
                </div>
                <div className='flex justify-start flex-col items-start w-1/2'>
                  <p className='text-amber-400'>Related Client</p>
                  <p className='mt-2'>{client?.name}</p>
                </div>
              </div>
              <hr className='text-gray-200' />
              <div className='mt-5 flex mb-5 max-sm:flex-col max-sm:gap-5'>
                <div className='w-1/2'>
                  <p className='text-amber-400'>Due Date</p>
                  <p className='mt-2'>{task?.deadline}</p>
                </div>
                <div className='flex justify-start flex-col items-start w-1/2'>
                  <p className='text-amber-400'>Status</p>
                  <p className='mt-2'>{task?.status}</p>
                </div>
              </div>
              <hr className='text-gray-200' />
            </div>

            <div className='mt-15'>
              <h2 className='text-lg font-bold mb-5 mt-5'>Attachments</h2>
              <div className="grid grid-cols-2 gap-5">
                {
                  task?.attachment?.map((im, index) => (
                    <img
                      key={index}
                      src={im}
                      alt={`attachment-${index}`}
                      className="w-full max-h-65 mb-5 border"
                    />
                  ))
                }

              </div>

            </div>
          </>
        }
      </div>
    </AdminLayout>
  )
}

export default ViewTask

// import React, { useEffect, useState } from 'react';
// import AdminLayout from '../../components/layout/admin-layout';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import baseURL from '../../services/baseURL';


// const ViewTask = () => {
//   const { id } = useParams();
//   const [task, setTask] = useState({ attachment: [] });
//   const [client, setClient] = useState({});
//   const [user, setUser] = useState({});

//   const getTask = async () => {
//     let token = localStorage.getItem("token");
//     try {
//       const { data } = await axios.get(`${baseURL}/task/api/get-task/${id}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       if (data.status === "success") {
//         setTask(data.data);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const getClient = async () => {
//     if (!task.clientId) return;
//     let token = localStorage.getItem("token");
//     try {
//       const { data } = await axios.get(`${baseURL}/client/api/get-client/${task.clientId}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       if (data.status === "success") setClient(data.data);
//     } catch (error) { console.log(error); }
//   };

//   const getUser = async () => {
//     if (!task.assignedTo) return;
//     let token = localStorage.getItem("token");
//     try {
//       const { data } = await axios.get(`${baseURL}/auth/api/get-user/${task.assignedTo}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       if (data.status === "success") setUser(data.data);
//     } catch (error) { console.log(error); }
//   };

//   useEffect(() => { getTask(); }, []);
//   useEffect(() => { getClient(); getUser(); console.log(task);
//    }, [task]);

//   return (
//     <AdminLayout>
//       <div className='w-full pr-10 my-10 max-sm:pr-5'>
//         <p><span className='text-gray-500'>Tasks /</span> Task Details</p>
//         <h2 className='text-3xl font-medium mt-7'>Task Details</h2>
//         <p className='text-xsm text-gray-500 mt-2'>View and manage task information</p>

//         {/* Task Info */}
//         <div>
//           <h3 className='text-lg font-bold mb-5 mt-5'>Task Information</h3>
//           <hr className='text-gray-200' />

//           <div className='mt-5 flex mb-5 max-sm:flex-col max-sm:gap-5'>
//             <div className='w-1/2'>
//               <p className='text-amber-400'>Title</p>
//               <p className='mt-2'>{task.title}</p>
//             </div>
//             <div className='flex justify-start flex-col items-start'>
//               <p className='text-amber-400'>Description</p>
//               <p className='mt-2'>{task.description}</p>
//             </div>
//           </div>

//           <hr className='text-gray-200' />
//           <div className='mt-5 flex mb-5 max-sm:flex-col max-sm:gap-5'>
//             <div className='w-1/2'>
//               <p className='text-amber-400'>Assigned To</p>
//               <p className='mt-2'>{user.name}</p>
//             </div>
//             <div className='flex justify-start flex-col items-start'>
//               <p className='text-amber-400'>Related Client</p>
//               <p className='mt-2'>{client.name}</p>
//             </div>
//           </div>

//           <hr className='text-gray-200' />
//           <div className='mt-5 flex mb-5 max-sm:flex-col max-sm:gap-5'>
//             <div className='w-1/2'>
//               <p className='text-amber-400'>Due Date</p>
//               <p className='mt-2'>{task.deadline}</p>
//             </div>
//             <div className='flex justify-start flex-col items-start'>
//               <p className='text-amber-400'>Status</p>
//               <p className='mt-2'>{task.status}</p>
//             </div>
//           </div>
//           <hr className='text-gray-200' />
//         </div>

//         {/* Attachments */}
//         <div className='mt-15'>
//           <h2 className='text-lg font-bold mb-5 mt-5'>Attachments</h2>
//           <div className='flex flex-col gap-5'>
//       {task.attachment?.map((item, index) => {
//   const ext = item.split('.').pop().toLowerCase();
//   const fileName = item.split('/').pop();

//   if (ext === 'pdf') {
//     return (
//       <a
//         href={item}   // Cloudinary raw PDF
//         key={index}
//         className='text-blue-600 underline cursor-pointer'
//       >
//         {fileName}
//       </a>
//     );
//   } else {
//     return <img key={index} src={item} alt={`attachment-${index}`} />;
//   }
// })}

//           </div>
//         </div>
//       </div>
//     </AdminLayout>
//   );
// };

// export default ViewTask;
