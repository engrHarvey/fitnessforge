"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image"; // Import the Image component from Next.js
import AuthWrapper from "../../../components/AuthWrapper";
import ProfileForm from "../../../components/ProfileForm";
import axios from "axios";
import Modal from "../../../components/Modal";
import UpdateWeight from "../../../components/updateWeight";
import CalculateBMI from "../../../components/CalculateBMI";
import IdealWeight from "../../../components/IdealWeight";

export default function Profile() {
  const [profileData, setProfileData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [latestBmiLog, setLatestBmiLog] = useState<number | null>(null);
  const [noBmiData, setNoBmiData] = useState(false);
  const [bmiCategory, setBmiCategory] = useState<string | null>(null);
  const [bmiCategoryColor, setBmiCategoryColor] = useState<string>("");

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found. Please login.");
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/current`, config);
        setProfileData(response.data.profile);

        fetchBmiLogs(response.data.profile.userId, config);

        setLoading(false);
      } catch (err) {
        setError("Error fetching profile data.");
        setLoading(false);
      }
    };

    const fetchBmiLogs = async (userId: string, config: any) => {
      try {
        const bmiLogResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/logs/user/${userId}/bmi`, config);
        if (bmiLogResponse.data?.length > 0) {
          const latestBmi = bmiLogResponse.data[0].value;
          setLatestBmiLog(latestBmi);
          determineBmiCategory(latestBmi);
        } else {
          setNoBmiData(true);
        }
      } catch (error) {
        setNoBmiData(true);
      }
    };

    fetchProfileData();
  }, []);

  const determineBmiCategory = (bmiValue: number) => {
    let category = "";
    let color = "";
    if (bmiValue < 18.5) {
      category = "Underweight";
      color = "text-blue-500";
    } else if (bmiValue >= 18.5 && bmiValue <= 24.9) {
      category = "Normal weight";
      color = "text-green-500";
    } else if (bmiValue >= 25 && bmiValue <= 29.9) {
      category = "Overweight";
      color = "text-orange-500";
    } else if (bmiValue >= 30) {
      category = "Obesity";
      color = "text-red-500";
    }
    setBmiCategory(category);
    setBmiCategoryColor(color);
  };

  const handleEditClick = () => setShowForm(true);
  const handleCloseModal = () => setShowForm(false);

  return (
    <AuthWrapper>
      <div
        className="min-h-screen flex flex-col bg-cover bg-center items-center justify-center px-6 py-10"
        style={{ backgroundImage: "url('/profile-bg.jpg')" }}
      >
        <div className="w-full max-w-5xl p-16 bg-dark bg-opacity-95 rounded-lg shadow-2xl text-white border border-secondary relative overflow-hidden backdrop-blur-sm">
          {/* Decorative Circle Elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-secondary rounded-full opacity-20 blur-3xl"></div>

          {/* Profile Content Split into Left and Right Sections */}
          {profileData ? (
            <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start space-y-8 lg:space-y-0 lg:space-x-12">
              {/* Left Section - Profile Photo and Basic Info */}
              <div className="flex flex-col items-center lg:items-start lg:w-1/3 space-y-6">
                {/* Profile Photo */}
                {profileData?.userImage && (
                  <div className="flex justify-center">
                    <Image
                      src={profileData.userImage}
                      alt="Profile Image"
                      width={176}
                      height={176}
                      className="rounded-full shadow-2xl border-8 border-primary ring-8 ring-orange-500"
                    />
                  </div>
                )}

                {/* Basic Information */}
                <div className="text-center lg:text-left space-y-4">
                  <h1 className="text-5xl font-extrabold text-primary">User Profile</h1>
                  <p className="text-lg">
                    <span className="font-semibold text-secondary">Name:</span> {profileData?.fname} {profileData?.lname}
                  </p>
                  <p className="text-lg">
                    <span className="font-semibold text-secondary">Age:</span> {profileData?.age}
                  </p>
                </div>
              </div>

              {/* Right Section - Profile Details and Functional Components */}
              <div className="lg:w-2/3 space-y-8">
                <p className="text-lg">
                  <span className="font-semibold text-secondary">Height:</span> {parseFloat(profileData?.height).toFixed(2)} m
                </p>

                {/* Weight Section with Inline Edit Button */}
                <div className="flex items-center space-x-2">
                  <p className="font-semibold text-secondary">Weight:</p>
                  <UpdateWeight
                    userId={profileData?.userId}
                    initialWeight={profileData?.weight}
                    initialUnit="kg"
                    onWeightUpdate={(newWeight) => setProfileData((prevData: any) => ({ ...prevData, weight: newWeight }))}
                  />
                </div>

                {/* Calculate BMI Component */}
                <CalculateBMI
                  profileData={profileData}
                  setProfileData={setProfileData}
                  setLatestBmiLog={setLatestBmiLog}
                  setNoBmiData={setNoBmiData}
                />

                {/* Display Stored BMI with Category */}
                {latestBmiLog && (
                  <div>
                    <p className="text-lg">
                      <span className="font-semibold text-secondary">BMI:</span> {latestBmiLog.toFixed(2)}{" "}
                      <span className={`${bmiCategoryColor} font-bold`}>{bmiCategory}</span>
                    </p>
                  </div>
                )}

                {/* Ideal Weight Component */}
                <IdealWeight profileData={profileData} />
              </div>
            </div>
          ) : (
            <p className="text-center text-xl text-gray-300">Loading profile data...</p>
          )}

          {/* Edit Button */}
          {profileData && (
            <div className="text-center mt-12">
              <button
                onClick={handleEditClick}
                className="bg-primary hover:bg-orange-600 text-white font-bold py-3 px-12 rounded-full transition duration-300 shadow-lg focus:ring-4 ring-orange-500"
              >
                {showForm ? "Cancel Edit" : "Edit Profile"}
              </button>
            </div>
          )}
        </div>

        {/* Modal for Profile Form */}
        <Modal show={showForm} onClose={handleCloseModal} title="Edit Profile">
          <ProfileForm profileData={profileData} setProfileData={setProfileData} />
        </Modal>
      </div>
    </AuthWrapper>
  );
}
