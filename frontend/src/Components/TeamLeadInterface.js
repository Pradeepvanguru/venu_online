import { MdOpenInNew } from "react-icons/md"; 
import { HiRefresh } from "react-icons/hi"; 
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { ProgressBar as BootstrapProgressBar } from 'react-bootstrap';
import Sidebar from './Sidebar';
import { notification, Dropdown, Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import { FaChevronDown, FaEllipsisV, FaTrash } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './TeamLeadInterface.css';

// Add import at the top
import LoadingSpinner from './LoadingSpinner';

const TeamLeadInterface = () => {
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedTaskId, setExpandedTaskId] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('userToken');
    const [isLoading, setIsLoading] = useState(false);
 

    useEffect(() => {
        let mounted = true;
        
        const init = async () => {
            if (!token) {
                notification.warning({
                    message: "Session expired!",
                    description: "You are not logged in. Please log in to continue."
                });
                navigate("/");
                return;
            }
            
            if (mounted) {
                setIsLoading(true);
                await fetchTasks();
            }
        };
    
        init();
    
        return () => {
            mounted = false;
            setIsLoading(false);
        };
    }, []);

    const fetchTasks = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_URL}/api/tasks`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            const fetchedTasks = await response.json();

            const updatedTasks = await Promise.all(fetchedTasks.map(async (task) => {
                try {
                  const start = new Date(task.startDate);
                  const end = new Date(task.endDate);
              
                  let totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
              
                  // Handle same day case
                  if (totalDays <= 0) {
                    if (start.getTime() === end.getTime()) {
                      totalDays = 1;
                    } else {
                      console.warn(`Invalid date range for task with moduleId ${task.moduleId}`);
                      return task;
                    }
                  }
              
                  const countRes = await axios.get(`${process.env.REACT_APP_URL}/api/data/${task.moduleId}/count`);
                  const submissionsCount = countRes.data.count;
                  const calculatedProgress = (submissionsCount / totalDays) * 100 || 0;
              
                  return {
                    ...task,
                    progress: Math.min(calculatedProgress, 100)
                  };
                } catch (error) {
                  console.error(`Error fetching submission count for ${task.moduleId}:`, error);
                  return task;
                }
              }));
              
            setTasks(updatedTasks);
            setFilteredTasks(updatedTasks);
        } catch (err) {
            console.error('Error fetching tasks:', err.response ? err.response.data : err.message);
            setError('Error fetching tasks');
        }finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setIsLoading (true);
        fetchTasks();
    }, []);

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        const filtered = tasks.filter(task => task.taskName.toLowerCase().includes(value.toLowerCase()));
        setFilteredTasks(filtered);
    };

    const handleDelete = async (taskId) => {
        setIsLoading(true);
        try {
          await axios.delete(`${process.env.REACT_APP_URL}/api/tasks/${taskId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTasks(prev => prev.filter(task => task._id !== taskId));
            setFilteredTasks(prev => prev.filter(task => task._id !== taskId));
        } catch (error) {
            console.error('Delete failed:', error);
        }finally {
            setIsLoading(false);
        }
    };

  // Update handleClickCard
const handleClickCard = (task) => {
    setIsLoading(true);
    try {
        localStorage.setItem('selectedTask', JSON.stringify(task));
        navigate('/file-modules');
    } catch (error) {
        notification.error({
            message: 'Error',
            description: 'Failed to process task'
        });
    } finally {
        setIsLoading(false);
    }
};

    const handleToggleExpand = (id) => {
        setExpandedTaskId(prev => (prev === id ? null : id));
    };

    const menuItems = (task) => (
        [
            // {
            //   key: 'edit',
            //   label: <span onClick={() => console.log("Edit", task._id)}>Edit</span>
            // },
            {
              key: 'delete',
              label: <span onClick={() => handleDelete(task._id)}>Delete <FaTrash /></span>
            }
          ]
    );
    const handleRefresh = () => {
        fetchTasks();
    };

    const TaskName = ({ taskName }) => {
        const [showFull, setShowFull] = useState(false);
        const capitalize = (text) =>
            text
              .split(' ')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
        
      
        const words = taskName.split(' ');
        const isLong = words.length > 8;
        const fullText = capitalize(taskName);
        const shortText = words.slice(0, 8).join(' ') + '... >';
        const short=capitalize(shortText)
      
        return (
          <p className='task-name' onClick={() => setShowFull(!showFull)} style={{ cursor: 'pointer',fontSize:'15px',color: 'rgb(4, 88, 172), rgba(8, 106, 171, 0.96)' }}>
            <strong>Task:</strong> {isLong && !showFull ? short : fullText}
          </p> 
        );
      };
   
      

    return (
        <div className="team-lead-interface">

            {isLoading && <LoadingSpinner />}
            {/* <div className="sidebar-toggle" onClick={toggleSidebar}>
            &#9776; 
            </div> */}

            <Sidebar />
            {/* className={`${sidebarVisible ? 'visible' : 'hidden'}`} */}

            <div className="content-wrapper">
           <center> <h2 className="module-heading">Tasks</h2></center>
            <button 
                onClick={handleRefresh} 
                className={`btn refresh-btn mt-0 ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
            >
                {isLoading ? (
                    <span className="spinner">
                        <HiRefresh className="refresh-icon spinning" />
                    </span>
                ) : (
                    <>Refresh <HiRefresh className="refresh-icon" /></>
                )}
            </button>
                <div>
                <input
                    type="text"
                    className="form-control mb-2 w-50"
                    placeholder="Search by task name..."
                    value={searchTerm}
                    onChange={handleSearch}
                    style={{
                        width: "300px",
                        padding: "10px",
                        borderRadius: "5px",
                        fontSize: "10px",
                    }}
                    
                />

                {error && <div className="alert alert-danger">{error}</div>}
                </div>
                {filteredTasks.length>0 ? (
                <ul className="list-group">
                    {filteredTasks.map(task => {
                        const progress = task.progress ?? 0;
                        const start = format(new Date(task.startDate), 'dd MMM yyyy');
                        const end = format(new Date(task.endDate), 'dd MMM yyyy');
                        const isExpanded = expandedTaskId === task._id;

                        return (
                            <li
                                key={task._id}
                                className="list-group-item task-card"
                            >
                                <div className="d-flex justify-content-between align-items-start py-4 ">
                    
                                    <div className="task-info">
                                    <button className='btn btn-outline-warning text-danger' onClick={() => handleClickCard(task)}  style={{float:'right',padding:'5px',margin:'30px',fontSize:'12px',fontWeight:'500'}}>Work Update <MdOpenInNew /></button>
                                    
                                        <div className="d-flex align-items-center mx-2">
                                            <span className="task-dates" >
                                            <TaskName taskName={task.taskName} />

                                           <strong className='task-name'> <p>Name: {task.assignName}</p></strong>
                                           
                                               <p className="task-name"  style={{fontSize:'10px' }}> {start} → {end}</p>
                                            </span>
                                        </div>
                                        <div className="mx-2" style={{ fontSize: '10px', marginTop: '5px',width:'75%',border:'1px solid rgba(7, 45, 142, 0.93)' ,borderRadius:'1rem'}}>
                                            <BootstrapProgressBar
                                                now={progress===0?<p className='px-2'>0%</p>:progress}
                                                label={`${Math.round(progress)}%`}
                                                style={{ height: '10px' }}
                                            />
                                        </div>
                                    </div>
                                    <Dropdown menu={{ items: menuItems(task) }} trigger={['click']}>
                                    <div onClick={(e) => e.stopPropagation()}>
                                        <FaEllipsisV className="dots-icon" />
                                    </div>
                                    </Dropdown>
                                    <FaChevronDown
                                                className="toggle-arrow"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleToggleExpand(task._id);
                                                }}
                                                style={{float:'right',marginTop:'70px'}}
                                            />
                                            

                                </div>
                                {isExpanded && (
                                    <div className="extra-details px-2" style={{ fontSize: '10px' }}>
                                        <p><strong>Module ID :</strong> {task.moduleId}</p>
                                        <p><strong>Email :</strong> {task.assignEmail}</p>
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>
                ): (
             <center> <div className="employee-dashboard__no-tasks mt-5">
                <p>No tasks available</p>
                <p>Overview of tasks, progress, and upcoming deadlines.</p>
              </div></center>
            )}
            </div>
        </div>
    );
};

export default TeamLeadInterface;
