import { PageLayout } from "@features/admin/components/PageLayout";
import LoadingData from "@features/_global/components/LoadingData";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAttendanceById } from "../hooks/useAttendance";
import {
  FaClock,
  FaExclamationTriangle,
  FaCheckCircle,
  FaUser,
  FaBriefcase,
  FaCalendarAlt,
  FaHistory,
  FaSignInAlt,
  FaSignOutAlt,
  FaMapMarkerAlt,
  FaCamera,
  FaInfoCircle,
  FaHashtag,
  FaEnvelope,
  FaBirthdayCake,
  FaHome,
  FaArrowLeft,
  FaUserClock,
  FaExclamationCircle
} from "react-icons/fa";

export const AttendanceDetailContent: React.FC = () => {
  const navigate = useNavigate();
  const { data: attendanceApi, isLoading } = useAttendanceById();
  const attendance = attendanceApi?.data;

  const formatDateTime = (dateTimeString: string) => {
    const dateTime = new Date(dateTimeString);
    return {
      date: dateTime.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
      time: dateTime.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    };
  };

  const calculateDuration = (checkin: string, checkout: string | null) => {
    if (!checkout) return "-";

    const checkinTime = new Date(checkin);
    const checkoutTime = new Date(checkout);
    const diffMs = checkoutTime.getTime() - checkinTime.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours} jam ${minutes} menit`;
  };

  const getStatus = (checkin: string | null, checkout: string | null, attendanceDate: string) => {
    if (!checkin) return { text: "Belum Check In", class: "secondary", icon: <FaClock className="text-secondary" /> };
    
    const today = new Date();
    const attendanceDateTime = new Date(attendanceDate);
    const isToday = today.toDateString() === attendanceDateTime.toDateString();
    
    if (!checkout) {
      if (isToday) {
        return { text: "Sedang Bekerja", class: "warning", icon: <FaUserClock className="text-warning" /> };
      } else {
        return { text: "Lupa Check Out", class: "danger", icon: <FaExclamationTriangle className="text-danger" /> };
      }
    }
    
    return { text: "Selesai", class: "success", icon: <FaCheckCircle className="text-success" /> };
  };

  if (isLoading) {
    return (
      <PageLayout title="Detail Attendance" headBackground="black">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
          <LoadingData />
        </div>
      </PageLayout>
    );
  }

  if (!attendance) {
    return (
      <PageLayout title="Detail Attendance" headBackground="black">
        <div className="text-center py-5">
          <div className="mb-4">
            <FaExclamationCircle className="text-danger" style={{ fontSize: "4rem" }} />
          </div>
          <h4 className="text-muted mb-3">Data attendance tidak ditemukan</h4>
          <button
            className="btn btn-primary d-flex align-items-center justify-content-center mx-auto"
            onClick={() => navigate("/dashboard/attendance")}
          >
            <FaArrowLeft className="me-2" />
            Kembali ke Daftar Attendance
          </button>
        </div>
      </PageLayout>
    );
  }

  const checkinFormatted = attendance.checkin_time
    ? formatDateTime(attendance.checkin_time)
    : null;
  const checkoutFormatted = attendance.checkout_time
    ? formatDateTime(attendance.checkout_time)
    : null;

  const status = getStatus(attendance.checkin_time, attendance.checkout_time, attendance.date);

  return (
    <PageLayout
      title="Detail Attendance"
      headBackground="black"
      action={{
        show: true,
        buttonTitle: "Kembali",
        buttonProps: {
          onClick: () => navigate("/dashboard/attendance"),
        },
      }}
    >
      <div className="container-fluid">
        {/* Header Card with Employee Info */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card shadow-sm border-0">
              <div className="card-body bg-gradient-primary text-white rounded-top">
                <div className="row align-items-center">
                  <div className="col-auto">
                    {attendance.employee?.image_url ? (
                      <img
                        src={attendance.employee.image_url}
                        alt="Employee"
                        className="rounded-circle border border-white"
                        style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div 
                        className="rounded-circle bg-white d-flex align-items-center justify-content-center"
                        style={{ width: '80px', height: '80px' }}
                      >
                        <FaUser className="text-primary" style={{ fontSize: '2rem' }} />
                      </div>
                    )}
                  </div>
                  <div className="col">
                    <h3 className="mb-1">{attendance.employee?.name || `Employee ID: ${attendance.employee_id}`}</h3>
                    <p className="mb-2 text-black opacity-75 d-flex align-items-center">
                      <FaBriefcase className="me-2" />
                      {attendance.employee?.divisi || 'Unknown Division'}
                    </p>
                    <div className="d-flex align-items-center gap-3">
                      <span className="badge bg-white text-primary px-3 py-2 rounded-pill d-flex align-items-center">
                        <FaCalendarAlt className="me-1" />
                        {checkinFormatted?.date || new Date(attendance.date).toLocaleDateString("id-ID")}
                      </span>
                      <span className={`badge bg-${status.class}-subtle text-${status.class} px-3 py-2 rounded-pill d-flex align-items-center`}>
                        {status.icon}
                        <span className="ms-1">{status.text}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Card */}
        {attendance.checkin_time && attendance.checkout_time && (
          <div className="row mb-4">
            <div className="col-12">
              <div className="card shadow-sm border-0">
                <div className="card-body text-center bg-light">
                  <div className="row">
                    <div className="col-md-4">
                      <div className="d-flex flex-column align-items-center">
                        <div className="bg-success-subtle p-3 rounded-circle mb-3">
                          <FaHistory className="text-success" style={{ fontSize: '1.5rem' }} />
                        </div>
                        <h4 className="text-success mb-1">
                          {calculateDuration(attendance.checkin_time, attendance.checkout_time)}
                        </h4>
                        <span className="text-muted">Total Durasi Kerja</span>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="d-flex flex-column align-items-center">
                        <div className="bg-primary-subtle p-3 rounded-circle mb-3">
                          <FaSignInAlt className="text-primary" style={{ fontSize: '1.5rem' }} />
                        </div>
                        <h5 className="text-primary mb-1">{checkinFormatted?.time}</h5>
                        <span className="text-muted">Waktu Check In</span>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="d-flex flex-column align-items-center">
                        <div className="bg-danger-subtle p-3 rounded-circle mb-3">
                          <FaSignOutAlt className="text-danger" style={{ fontSize: '1.5rem' }} />
                        </div>
                        <h5 className="text-danger mb-1">{checkoutFormatted?.time}</h5>
                        <span className="text-muted">Waktu Check Out</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Check In & Check Out Cards */}
        <div className="row">
          {/* Check In Card */}
          <div className="col-lg-6 mb-4">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-header bg-success text-white border-0 d-flex align-items-center">
                <FaSignInAlt className="me-2" style={{ fontSize: '1.2rem' }} />
                <h5 className="mb-0">Check In</h5>
              </div>
              <div className="card-body mt-4">
                {attendance.checkin_time ? (
                  <div className="space-y-4">
                    <div className="row g-3">
                      <div className="col-12">
                        <div className="d-flex align-items-center p-3 bg-light rounded">
                          <div className="bg-success-subtle p-2 rounded me-3">
                            <FaClock className="text-success" style={{ fontSize: '1.2rem' }} />
                          </div>
                          <div>
                            <h6 className="mb-1 text-success">Waktu Check In</h6>
                            <p className="mb-0 h5">{checkinFormatted?.time}</p>
                            <small className="text-muted">{checkinFormatted?.date}</small>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-12">
                        <div className="d-flex align-items-center p-3 bg-light rounded">
                          <div className="bg-primary-subtle p-2 rounded me-3">
                            <FaMapMarkerAlt className="text-primary" style={{ fontSize: '1.2rem' }} />
                          </div>
                          <div>
                            <h6 className="mb-1 text-primary">Lokasi</h6>
                            <p className="mb-0 font-monospace">
                              {attendance.checkin_latitude?.toFixed(6)}, {attendance.checkin_longitude?.toFixed(6)}
                            </p>
                            <small className="text-muted">Koordinat GPS</small>
                          </div>
                        </div>
                      </div>
                      
                      {attendance.checkin_image_url && (
                        <div className="col-12">
                          <div className="d-flex align-items-center mb-2">
                            <div className="bg-success-subtle p-2 rounded me-2">
                              <FaCamera className="text-success" style={{ fontSize: '1rem' }} />
                            </div>
                            <h6 className="mb-0">Foto Check In</h6>
                          </div>
                          <div className="text-center">
                            <img
                              src={attendance.checkin_image_url}
                              alt="Check In"
                              className="img-fluid rounded shadow"
                              style={{ maxHeight: "250px", objectFit: "cover" }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <div className="bg-secondary-subtle p-4 rounded-circle d-inline-block mb-3">
                      <FaClock className="text-secondary" style={{ fontSize: '2rem' }} />
                    </div>
                    <h5 className="text-muted mb-2">Belum Check In</h5>
                    <p className="text-muted">Karyawan belum melakukan check in pada tanggal ini</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Check Out Card */}
          <div className="col-lg-6 mb-4">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-header bg-danger text-white border-0 d-flex align-items-center">
                <FaSignOutAlt className="me-2" style={{ fontSize: '1.2rem' }} />
                <h5 className="mb-0">Check Out</h5>
              </div>
              <div className="card-body mt-4">
                {attendance.checkout_time ? (
                  <div className="space-y-4">
                    <div className="row g-3">
                      <div className="col-12">
                        <div className="d-flex align-items-center p-3 bg-light rounded">
                          <div className="bg-danger-subtle p-2 rounded me-3">
                            <FaClock className="text-danger" style={{ fontSize: '1.2rem' }} />
                          </div>
                          <div>
                            <h6 className="mb-1 text-danger">Waktu Check Out</h6>
                            <p className="mb-0 h5">{checkoutFormatted?.time}</p>
                            <small className="text-muted">{checkoutFormatted?.date}</small>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-12">
                        <div className="d-flex align-items-center p-3 bg-light rounded">
                          <div className="bg-primary-subtle p-2 rounded me-3">
                            <FaMapMarkerAlt className="text-primary" style={{ fontSize: '1.2rem' }} />
                          </div>
                          <div>
                            <h6 className="mb-1 text-primary">Lokasi</h6>
                            <p className="mb-0 font-monospace">
                              {attendance.checkout_latitude?.toFixed(6)}, {attendance.checkout_longitude?.toFixed(6)}
                            </p>
                            <small className="text-muted">Koordinat GPS</small>
                          </div>
                        </div>
                      </div>
                      
                      {attendance.checkout_image_url && (
                        <div className="col-12">
                          <div className="d-flex align-items-center mb-2">
                            <div className="bg-danger-subtle p-2 rounded me-2">
                              <FaCamera className="text-danger" style={{ fontSize: '1rem' }} />
                            </div>
                            <h6 className="mb-0">Foto Check Out</h6>
                          </div>
                          <div className="text-center">
                            <img
                              src={attendance.checkout_image_url}
                              alt="Check Out"
                              className="img-fluid rounded shadow"
                              style={{ maxHeight: "250px", objectFit: "cover" }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <div className="bg-secondary-subtle p-4 rounded-circle d-inline-block mb-3">
                      <FaClock className="text-secondary" style={{ fontSize: '2rem' }} />
                    </div>
                    <h5 className="text-muted mb-2">
                      {status.text === "Lupa Check Out" ? "Lupa Check Out" : "Belum Check Out"}
                    </h5>
                    <p className="text-muted">
                      {status.text === "Lupa Check Out" 
                        ? "Karyawan lupa melakukan check out pada hari ini" 
                        : "Karyawan belum melakukan check out"
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="row">
          <div className="col-12">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-light border-0 d-flex align-items-center">
                <FaInfoCircle className="me-2" />
                <h6 className="mb-0">Informasi Tambahan</h6>
              </div>
              <div className="card-body mt-4">
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="d-flex align-items-center p-3 bg-light rounded">
                      <div className="bg-primary-subtle p-2 rounded me-3">
                        <FaHashtag className="text-primary" />
                      </div>
                      <div>
                        <small className="text-muted">ID Attendance</small>
                        <p className="mb-0 fw-bold">{attendance.id}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-center p-3 bg-light rounded">
                      <div className="bg-primary-subtle p-2 rounded me-3">
                        <FaEnvelope className="text-primary" />
                      </div>
                      <div>
                        <small className="text-muted">Email</small>
                        <p className="mb-0">{attendance.employee?.email || 'Tidak tersedia'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-center p-3 bg-light rounded">
                      <div className="bg-primary-subtle p-2 rounded me-3">
                        <FaBirthdayCake className="text-primary" />
                      </div>
                      <div>
                        <small className="text-muted">Tanggal Lahir</small>
                        <p className="mb-0">
                          {attendance.employee?.date_of_birth 
                            ? new Date(attendance.employee.date_of_birth).toLocaleDateString('id-ID')
                            : 'Tidak tersedia'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-center p-3 bg-light rounded">
                      <div className="bg-primary-subtle p-2 rounded me-3">
                        <FaHome className="text-primary" />
                      </div>
                      <div>
                        <small className="text-muted">Alamat</small>
                        <p className="mb-0">{attendance.employee?.address || 'Tidak tersedia'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};