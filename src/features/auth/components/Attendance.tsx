import { useState, useRef, useEffect, useCallback } from "react";
import Webcam from "react-webcam";
import {
  FaCamera,
  FaMapMarkerAlt,
  FaUser,
  FaBuilding,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaRedo,
  FaArrowLeft,
} from "react-icons/fa";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import { useEmployeeVerify } from "@features/admin/employee/hooks/useEmployee";
import { EmployeeModel } from "@core/model/employee";
import { useNavigate } from "react-router-dom";
import { useAttendanceCheck } from "@features/admin/attendance/hooks/useAttendance";
import { CONFIG_APP } from "@core/configs/app";

// Fix Leaflet default marker icons
interface FixedDefaultIcon extends L.Icon.Default {
  _getIconUrl?: string;
}

delete (L.Icon.Default.prototype as FixedDefaultIcon)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Types
type Location = {
  latitude: number;
  longitude: number;
};

type Step = "upload" | "camera" | "verified";

interface AttendanceMapProps {
  userLocation: Location | null;
  showAttendanceLocation?: boolean;
  officeLat: number;
  officeLng: number;
  allowedRadius: number;
}

const AttendanceMap: React.FC<AttendanceMapProps> = ({
  userLocation,
  showAttendanceLocation = false,
  officeLat,
  officeLng,
  allowedRadius,
}) => {
  const markerRef = useRef<L.Marker | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  // const [mapKey, setMapKey] = useState(0);

  // const center: [number, number] = useMemo(() => {
  //   return [officeLat, officeLng];
  // }, [officeLat, officeLng]);

  const center: [number, number] = [
    userLocation?.latitude ?? 0,
    userLocation?.longitude ?? 0,
  ];

  // Force refresh map ketika ada perubahan critical
  // useEffect(() => {
  //   setMapKey((prev) => prev + 1);
  // }, [userLocation, showAttendanceLocation]);

  useEffect(() => {
    if (
      markerRef.current &&
      userLocation?.latitude &&
      userLocation?.longitude
    ) {
      markerRef.current.setLatLng([
        userLocation?.latitude,
        userLocation?.longitude,
      ]);
      mapRef.current?.panTo([userLocation?.latitude, userLocation?.longitude]);
    }
  }, [userLocation?.latitude, userLocation?.longitude, userLocation]);

  if (!userLocation) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <div className="text-center">
          <FaMapMarkerAlt className="text-red-500 text-3xl mx-auto mb-2" />
          <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">
            {showAttendanceLocation ? "Lokasi Absensi" : "Lokasi Anda"}
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-xs">
            {showAttendanceLocation
              ? "Lokasi tidak tersedia"
              : "Sedang mencari lokasi..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <MapContainer
        // key={`map-${mapKey}-${userLocation.latitude}-${userLocation.longitude}`} // Unique key
        center={center}
        zoom={15}
        ref={mapRef}
        style={{ height: "100%", width: "100%" }}
        dragging={false}
        touchZoom={false}
        zoomControl={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        whenReady={() => {
          setTimeout(() => {
            if (mapRef.current) {
              mapRef.current.invalidateSize();
            }
          }, 100);
        }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {/* User location marker */}
        <Marker position={center} ref={markerRef}>
          <Popup>
            {showAttendanceLocation ? "Lokasi Absensi" : "Lokasi Anda"}
          </Popup>
        </Marker>

        {/* Attendance radius circle - pastikan selalu render */}
        <Circle
          center={[officeLat, officeLng]}
          radius={allowedRadius}
          pathOptions={{
            color: "#10b981",
            fillColor: "#34d399",
            fillOpacity: 0.2,
            weight: 3,
            dashArray: "10, 10",
          }}
        />
      </MapContainer>
    </div>
  );
};

type MapWrapperProps = AttendanceMapProps;

const MapWrapper: React.FC<MapWrapperProps> = (props) => {
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    // Reset error state when props change
    setMapError(false);
  }, [props.userLocation]);

  if (mapError) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <div className="text-center">
          <FaExclamationTriangle className="text-red-500 text-3xl mx-auto mb-2" />
          <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">
            Error loading map
          </p>
          <button
            onClick={() => setMapError(false)}
            className="mt-2 px-3 py-1 bg-blue-500 text-white text-xs rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  try {
    return <AttendanceMap {...props} />;
  } catch (error) {
    console.error("Map rendering error:", error);
    setMapError(true);
    return null;
  }
};

interface BackButtonProps {
  onClick: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick }) => (
  <div className="fixed top-4 left-4 z-50">
    <button
      onClick={onClick}
      className="bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white hover:text-gray-900 transition-all duration-300 flex items-center justify-center w-12 h-12 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 border border-gray-200"
    >
      <FaArrowLeft className="text-lg" />
    </button>
  </div>
);

interface ErrorAlertProps {
  error: string | null;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ error }) => {
  if (!error) return null;

  return (
    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
      <FaExclamationTriangle className="mr-2" />
      <span className="text-sm">{error}</span>
    </div>
  );
};

interface InputFieldProps {
  icon: React.ComponentType<{ className?: string }>;
  value?: string;
  placeholder: string;
  disabled?: boolean;
  iconColor?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  icon: Icon,
  value,
  placeholder,
  disabled = true,
  iconColor = "text-gray-400",
}) => (
  <div className="flex items-center space-x-3">
    <Icon className={iconColor} />
    <input
      type="text"
      value={value || ""}
      placeholder={placeholder}
      className="flex-1 p-3 border border-gray-300 rounded-lg bg-gray-100 text-sm font-semibold"
      disabled={disabled}
    />
  </div>
);

const AttendancePage: React.FC = () => {
  const officeLat = CONFIG_APP.OFFICE_LATITUDE || 0;
  const officeLng = CONFIG_APP.OFFICE_LONGITUDE || 0;
  const allowedRadius = 300;

  const [step, setStep] = useState<Step>("upload");
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [employeeData, setEmployeeData] = useState<EmployeeModel | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [cameraReady, setCameraReady] = useState(false);
  // const [mapRefreshKey, setMapRefreshKey] = useState(0); // Key untuk force refresh map

  const [locationValidated, setLocationValidated] = useState(false);

  const webcamRef = useRef<Webcam>(null);
  const navigate = useNavigate();

  const mutationEmployee = useEmployeeVerify();
  const mutationAttendanceCheck = useAttendanceCheck();

  // Webcam configuration for mobile-friendly aspect ratio
  const videoConstraints = {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode: "user",
    aspectRatio: 16 / 9,
  };

  // Get user location dengan retry mechanism
  useEffect(() => {
    let watchId = null;

    const handlePositionUpdate = (position: GeolocationPosition) => {
      const validation = validateLocation(position);
      // alert(validation.isValid);

      if (!validation.isValid) {
        setError(validation.error || "Lokasi tidak valid");
        setLocationValidated(false);
        return;
      }

      // Jika validasi berhasil
      if (!locationValidated) {
        setLocationValidated(true);
      }

      setUserLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      setError("");
      // setMapRefreshKey((prev) => prev + 1);
    };

    const handleError = (error: GeolocationPositionError) => {
      console.error("Error getting location:", error);
      setError("Gagal mendapatkan lokasi");
    };

    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        handlePositionUpdate,
        handleError,
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0, // Tidak menggunakan cached position
        }
      );
    }

    // Cleanup function untuk stop tracking saat komponen unmount
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [locationValidated]);

  // Cleanup webcam
  // Cleanup webcam
  useEffect(() => {
    const currentWebcamRef = webcamRef.current; // Capture the current value of the ref
    return () => {
      if (currentWebcamRef) {
        const stream = currentWebcamRef.video?.srcObject;
        if (stream) {
          const tracks = (stream as MediaStream).getTracks();
          tracks.forEach((track) => track.stop());
        }
      }
    };
  }, []);
  // Start camera
  const startCamera = () => {
    setError("");
    setCameraReady(false);
    setStep("camera");
  };

  // Verify face
  const verifyFace = useCallback(
    async (imageData: string) => {
      setError("");
      setIsLoading(true);
      try {
        const response = await fetch(imageData);
        const blob = await response.blob();
        const formData = new FormData();
        formData.append("image", blob);

        const employeeResponse = await mutationEmployee.mutateAsync(formData);
        console.log(employeeResponse);
        if (employeeResponse.data) {
          setEmployeeData(employeeResponse?.data);
        } else {
          setEmployeeData(null);
        }

        setStep("verified");
        // Force refresh map di step verified
        // setMapRefreshKey((prev) => prev + 1);
      } catch (error) {
        console.error("Verification failed:", error);
        setError("Verifikasi wajah gagal. Silakan coba lagi.");
        setTimeout(() => setError(""), 3000);
      } finally {
        setIsLoading(false);
      }
    },
    [mutationEmployee]
  );

  // Capture image from webcam
  const captureImage = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);
        verifyFace(imageSrc);
      }
    }
  }, [verifyFace]);

  // Handle attendance
  const handleAttendance = async () => {
    if (!employeeData || !userLocation || !capturedImage) return;

    setIsLoading(true);
    try {
      const response = await fetch(capturedImage);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append("image", blob);
      formData.append("latitude", userLocation.latitude.toString());
      formData.append("longitude", userLocation.longitude.toString());
      formData.append("employee_id", employeeData.id.toString());

      const type = employeeData.attendance_today ? "checkout" : "checkin";

      await mutationAttendanceCheck.mutateAsync({
        data: formData,
        type,
      });

      resetForm();
    } catch (error) {
      console.error("Attendance failed:", error);
      setError("Absen gagal. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setStep("upload");
    setEmployeeData(null);
    setCapturedImage(null);
    setError("");
    setCameraReady(false);
    setLocationValidated(false);
    // Force refresh map saat reset
    // setMapRefreshKey((prev) => prev + 1);
  };

  // Handle webcam ready
  const onUserMedia = () => {
    setCameraReady(true);
  };

  // Handle webcam error
  const onUserMediaError = (error: string | DOMException) => {
    console.error("Webcam error:", error);
    setError(
      "Tidak dapat mengakses kamera. Pastikan Anda memberikan izin kamera dan tidak ada aplikasi lain yang menggunakan kamera."
    );
    setCameraReady(false);
    setStep("upload");
  };

  const renderUploadStep = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
      <BackButton onClick={() => navigate(-1)} />

      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaClock className="text-blue-600 text-3xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Sistem Absensi
          </h1>
          <p className="text-gray-600">
            Klik tombol di bawah untuk memulai absensi
          </p>
        </div>

        <ErrorAlert error={error} />

        <div
          onClick={startCamera}
          className="border-2 border-dashed border-blue-300 rounded-2xl p-12 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 transform hover:scale-105"
        >
          <FaCamera className="text-blue-500 text-5xl mx-auto mb-4" />
          <p className="text-blue-600 font-semibold text-lg">Mulai Kamera</p>
          <p className="text-gray-500 text-sm mt-2">
            Klik untuk mengaktifkan kamera dan mulai absensi
          </p>
        </div>

        <div className="mt-6 space-y-4">
          <InputField
            icon={FaUser}
            placeholder="Nama (akan terisi otomatis setelah verifikasi)"
          />

          <InputField
            icon={FaBuilding}
            placeholder="Divisi (akan terisi otomatis setelah verifikasi)"
          />

          <div className="flex items-center space-x-3">
            <FaMapMarkerAlt className="text-green-500" />
            <div className="flex-1 p-3 border border-gray-300 rounded-lg bg-gray-50">
              <p className="text-xs text-gray-600">
                {userLocation
                  ? `Lat: ${userLocation.latitude.toFixed(
                      6
                    )}, Lng: ${userLocation.longitude.toFixed(6)}`
                  : "Mendapatkan lokasi..."}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-6 h-64 rounded-lg overflow-hidden border border-gray-300">
          <MapWrapper
            // key={`upload-${mapRefreshKey}`}
            userLocation={userLocation}
            officeLat={officeLat}
            officeLng={officeLng}
            allowedRadius={allowedRadius}
          />
        </div>
      </div>
    </div>
  );

  const renderCameraStep = () => (
    <div className="min-h-screen bg-black flex flex-col overflow-hidden">
      <BackButton onClick={resetForm} />

      {/* Header */}
      <div className="bg-white/95 absolute top-4 z-10 right-4 left-4 backdrop-blur-sm rounded-2xl p-4 text-center shadow-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-1">Deteksi Wajah</h2>
        <p className="text-gray-600 text-sm">
          Posisikan wajah Anda di dalam frame dan klik capture
        </p>
        {!cameraReady && (
          <p className="text-blue-600 text-xs mt-2 flex items-center justify-center">
            <FaClock className="mr-1 animate-spin" />
            Mengaktifkan kamera...
          </p>
        )}
      </div>

      {/* Camera Container - Full screen without scroll */}
      <div className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0">
          {step === "camera" && (
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              onUserMedia={onUserMedia}
              onUserMediaError={onUserMediaError}
              className="w-full h-full object-cover"
            />
          )}

          {/* Enhanced Frame overlay */}
          <div className="absolute inset-8 border-2 border-blue-400 rounded-xl pointer-events-none">
            <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-blue-400 rounded-tl-xl"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-blue-400 rounded-tr-xl"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-blue-400 rounded-bl-xl"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-blue-400 rounded-br-xl"></div>

            {/* Center guide */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 border-2 border-blue-400 rounded-full bg-blue-400/20"></div>
          </div>

          {/* Camera status indicator */}
          {cameraReady && (
            <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center shadow-lg">
              <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
              LIVE
            </div>
          )}

          {/* Loading overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
              <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl text-center shadow-2xl">
                <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-lg text-gray-800 font-semibold mb-2">
                  Memverifikasi wajah...
                </p>
                <p className="text-sm text-gray-600">Mohon tunggu sebentar</p>
              </div>
            </div>
          )}

          {/* Controls - Positioned at bottom of camera */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent py-12 px-6">
            {error && (
              <div className="mb-4 p-3 bg-red-100/90 backdrop-blur-sm border border-red-400 text-red-700 rounded-lg flex items-center">
                <FaExclamationTriangle className="mr-2" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div className="flex justify-center space-x-4">
              <button
                onClick={resetForm}
                className="px-4 py-3 bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-xl hover:bg-white/30 transition-colors flex items-center shadow-lg"
                disabled={isLoading}
              >
                Batal
              </button>
              <button
                onClick={captureImage}
                className="px-4 py-3 bg-blue-600/90 backdrop-blur-sm text-white rounded-xl hover:bg-blue-700/90 transition-colors flex items-center disabled:opacity-50 shadow-lg"
                disabled={isLoading || !cameraReady}
              >
                <FaCamera className="mr-2" />
                Capture
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderVerifiedStep = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4 flex items-center justify-center">
      <BackButton onClick={() => navigate(-1)} />

      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCheckCircle className="text-green-600 text-3xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Verifikasi Berhasil
          </h2>
          <p className="text-gray-600">Identitas Anda telah terverifikasi</p>
          {employeeData && (
            <p className="text-green-600 text-sm mt-1">
              Confidence: {((employeeData?.confidence || 0) * 100).toFixed(1)}%
            </p>
          )}
        </div>

        {capturedImage && (
          <div className="flex justify-center mb-6">
            <div className="relative">
              <img
                src={capturedImage}
                alt="Captured face"
                className="w-24 h-24 rounded-full object-cover border-4 border-green-500 shadow-lg"
              />
              <div className="absolute -bottom-2 -right-2 bg-green-500 text-white rounded-full p-1">
                <FaCheckCircle className="text-sm" />
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4 mb-6">
          <InputField
            icon={FaUser}
            value={employeeData?.name}
            placeholder="Nama"
            iconColor="text-green-500"
          />

          <InputField
            icon={FaBuilding}
            value={employeeData?.divisi}
            placeholder="Divisi"
            iconColor="text-green-500"
          />

          <div className="flex items-center space-x-3">
            <FaMapMarkerAlt className="text-green-500" />
            <div className="flex-1 p-3 border border-gray-300 rounded-lg bg-gray-50">
              <p className="text-sm text-gray-600">
                {userLocation
                  ? `Lat: ${userLocation.latitude.toFixed(
                      6
                    )}, Lng: ${userLocation.longitude.toFixed(6)}`
                  : "Lokasi tidak tersedia"}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 h-64 rounded-lg overflow-hidden border border-green-300">
          <MapWrapper
            // key={`verified-${mapRefreshKey}`}
            userLocation={userLocation}
            showAttendanceLocation={true}
            officeLat={officeLat}
            officeLng={officeLng}
            allowedRadius={allowedRadius}
          />
        </div>

        <ErrorAlert error={error} />
        <button onClick={() => alert(locationValidated)}>Coba lah</button>
        <button
          onClick={handleAttendance}
          disabled={isLoading || !userLocation || !locationValidated}
          className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
            employeeData?.attendance_today
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-green-500 hover:bg-green-600 text-white"
          } ${
            isLoading || !userLocation || !locationValidated
              ? "opacity-50 cursor-not-allowed"
              : ""
          } shadow-lg transform hover:scale-105`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
              <span>Memproses...</span>
            </div>
          ) : (
            <>
              <FaClock className="inline mr-2" />
              {employeeData?.attendance_today ? "Check Out" : "Check In"}
            </>
          )}
        </button>

        <button
          onClick={resetForm}
          className="w-full mt-3 py-2 text-gray-600 hover:text-gray-800 transition-colors flex items-center justify-center"
        >
          <FaRedo className="mr-2" />
          Mulai Ulang
        </button>
      </div>
    </div>
  );

  return (
    <div>
      {step === "upload" && renderUploadStep()}
      {step === "camera" && renderCameraStep()}
      {step === "verified" && renderVerifiedStep()}
    </div>
  );
};

export default AttendancePage;


const detectFakeGPS = (position: GeolocationPosition): boolean => {
  const { coords, timestamp } = position;

  // 1. Cek accuracy yang terlalu sempurna atau sangat rendah (indikasi fake GPS)
  // Perluasan: Menggunakan rentang yang lebih masuk akal. Accuracy 0 sangat mencurigakan.
  // Accuracy di bawah 5m juga bisa dicurigai, terutama jika konsisten.
  if (coords.accuracy === 0 || coords.accuracy < 3) {
    return true;
  }

  // 2. Cek koordinat yang terlalu presisi (fake GPS sering memberikan koordinat tidak realistis)
  // Penyesuaian: Lebih fokus pada jumlah desimal yang tidak wajar dan pola berulang (misal, banyak angka nol).
  const latStr = coords.latitude.toString();
  const lngStr = coords.longitude.toString();

  // Jika koordinat memiliki lebih dari 7 desimal (GPS asli jarang sepresisi ini)
  // ATAU memiliki pola '0000' atau '9999' di akhir setelah 6 desimal
  if (
    (latStr.includes(".") && latStr.split(".")[1].length > 7) ||
    (lngStr.includes(".") && lngStr.split(".")[1].length > 7) ||
    (latStr.includes(".") && latStr.split(".")[1].length > 5 && (latStr.endsWith("0000") || latStr.endsWith("9999"))) ||
    (lngStr.includes(".") && lngStr.split(".")[1].length > 5 && (lngStr.endsWith("0000") || lngStr.endsWith("9999")))
  ) {
    return true;
  }

  // 3. Cek jika altitude terlalu sempurna (fake GPS sering memberikan altitude bulat atau tidak berubah)
  // Penyesuaian: Altitude 0 atau bulat sempurna (tanpa desimal) kecuali jika memang di permukaan laut atau dataran rendah yang sangat datar.
  // Menambahkan ambang batas untuk altitude non-nol yang bulat.
  if (
    coords.altitude !== null &&
    coords.altitude !== 0 &&
    coords.altitude % 1 === 0 && // Bilangan bulat
    coords.accuracy < 10 // Pastikan akurasi juga baik, jangan sampai karena akurasi buruk jadi false positive
  ) {
    return true;
  }

  // 4. Cek jika speed dan heading tersedia tapi nilainya 0 (tidak realistis saat berpindah)
  // Penyesuaian: Kondisi ini hanya relevan jika perangkat seharusnya bergerak.
  // Jika perangkat diam, speed dan heading 0 adalah normal.
  // Kita asumsikan ini untuk deteksi yang lebih agresif, tetapi bisa disesuaikan jika ada konteks pergerakan.
  if (coords.speed !== null && coords.heading !== null && coords.speed === 0 && coords.heading === 0 && coords.accuracy < 20) {
    // Menambahkan pengecekan akurasi agar tidak false positive saat GPS belum sepenuhnya lock
    return true;
  }


  // 5. Cek timestamp yang tidak wajar (fake GPS kadang memberikan timestamp yang tidak konsisten)
  // Penyesuaian: Memperluas rentang toleransi sedikit untuk menghindari false positive karena latensi jaringan/sistem.
  // Juga, cek jika timestamp di masa depan.
  const now = Date.now();
  const timeDiff = Math.abs(now - timestamp);

  // Jika timestamp terlalu jauh dari waktu sekarang (lebih dari 60 detik)
  // Atau jika timestamp di masa depan (lebih dari 5 detik ke depan)
  if (timeDiff > 60000 || (timestamp - now > 5000)) {
    return true;
  }

  // 6. Cek adanya mock location API (hanya bisa dilakukan di Android melalui Cordova/React Native plugins)
  // Ini adalah deteksi yang paling kuat, tetapi membutuhkan integrasi native.
  // Contoh pseudo-code (bukan bagian dari GeolocationPosition standar):
  // if (position.isFromMockProvider) {
  //   return true;
  // }

  return false;
};

// Fungsi untuk validasi lokasi dengan multiple checks
const validateLocation = (
  position: GeolocationPosition
): { isValid: boolean; error?: string } => {
  // Cek koordinat nol (seringkali indikasi GPS tidak aktif/error)
  if (position.coords.latitude === 0 && position.coords.longitude === 0) {
    return {
      isValid: false,
      error: "Koordinat tidak valid (0,0). Pastikan GPS aktif dengan benar atau coba lagi.",
    };
  }

  // Cek akurasi terlalu rendah (sinyal buruk atau indoor)
  // Ambang batas 100m mungkin terlalu longgar, bisa disesuaikan tergantung kebutuhan.
  // Untuk absensi, akurasi di bawah 20-50m mungkin lebih ideal.
  if (position.coords.accuracy > 50) { // Misalnya, akurasi lebih dari 50 meter dianggap buruk
    return {
      isValid: false,
      error: "Akurasi GPS terlalu rendah (" + position.coords.accuracy.toFixed(2) + "m). Harap tunggu hingga GPS mendapat sinyal yang lebih baik.",
    };
  }

  // Panggil deteksi fake GPS setelah validasi dasar lokasi
  if (detectFakeGPS(position)) {
    return {
      isValid: false,
      error:
        "Terdeteksi penggunaan lokasi palsu. Harap gunakan lokasi asli untuk absensi.",
    };
  }

  return { isValid: true };
};