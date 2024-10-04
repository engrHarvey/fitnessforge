"use client";

import React, { useState, useRef, useEffect } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import axios from 'axios';
import { convertHeightToMeters, HeightUnit } from '../utils/convertHeightToMeters'; // Import the function and type
import { convertWeightToKg, WeightUnit } from '../utils/convertWeightToKg'; // Import weight converter

export default function ProfileForm({ profileData, setProfileData }: any) {
  const [feet, setFeet] = useState(""); 
  const [inches, setInches] = useState("");
  const [heightUnit, setHeightUnit] = useState<HeightUnit>("m"); // Explicitly type the state as HeightUnit
  const [weightUnit, setWeightUnit] = useState<WeightUnit>("kg"); // Explicitly type the state as WeightUnit
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [crop, setCrop] = useState<Crop>({ unit: "%", width: 30, height: 30, x: 0, y: 0 });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [aspect, setAspect] = useState<number | undefined>(1);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
  const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null); // State to store the cropped Blob file
  const generateRandomString = () => Math.random().toString(36).substring(2, 14);

  const imageRef = useRef<HTMLImageElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as HTMLInputElement & HTMLSelectElement;
    if (name === "profilePhoto" && files && files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result as string);
      setFile(files[0]);
      reader.readAsDataURL(files[0]);
    } else if (name === "heightUnit") {
      setHeightUnit(value as HeightUnit); // Type assertion to constrain value to HeightUnit
    } else if (name === "weightUnit") {
      setWeightUnit(value as WeightUnit); // Update type of weight unit
    } else {
      setProfileData({ ...profileData, [name]: value });
    }
  };

  // Use the external convertHeightToMeters function
  const heightInMeters = convertHeightToMeters({
    height: profileData.height,
    feet,
    inches,
    heightUnit, // Pass the properly typed height unit
  });

  // Use the external convertWeightToKg function
  const weightInKg = convertWeightToKg({
    weight: profileData.weight,
    weightUnit,
  });

  const calculateAge = (birthdate: string) => {
    const birthDateObj = new Date(birthdate);
    const diff = Date.now() - birthDateObj.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const age = calculateAge(profileData.birthdate);

    const updatedProfileData = {
      fname: profileData.firstName,
      lname: profileData.lastName,
      height: heightInMeters,
      weight: weightInKg,
      age,
      gender: profileData.gender,
      birthdate: profileData.birthdate,
    };

    try {
      const formData = new FormData();
      Object.keys(updatedProfileData).forEach((key) => {
        formData.append(key, updatedProfileData[key as keyof typeof updatedProfileData]?.toString() || "");
      });

      // Generate a random string to append to the cropped image name
      const randomString = generateRandomString();

      // If cropped image is available, use it. Otherwise, fallback to original file.
      if (croppedBlob) {
        formData.append('profilePhoto', croppedBlob, `cropped-image-${randomString}.jpg`);
      } else if (file) {
        formData.append('profilePhoto', file);
      }

      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.post('http://localhost:5000/api/profiles/create', formData, config);
      console.log('Profile saved successfully:', response.data);

      // Refresh the profile page after successful update
    window.location.reload();
    
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  useEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !imageRef.current) {
      return;
    }

    const canvas = previewCanvasRef.current;
    const image = imageRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );

      // Convert canvas content to Blob
      canvas.toBlob((blob) => {
        setCroppedBlob(blob); // Save the cropped Blob file
      }, "image/jpeg");
    }
  }, [completedCrop]);

  return (
    <form onSubmit={handleSubmit} className="space-y-8 p-6 bg-dark rounded-lg shadow-md">
      <div className="flex flex-col space-y-3">
        <label className="text-lg font-semibold text-secondary">Profile Photo</label>
        <input
          type="file"
          name="profilePhoto"
          accept="image/*"
          onChange={handleChange}
          className="text-secondary bg-dark p-3 rounded border border-secondary focus:ring focus:ring-primary"
        />
        {imageSrc && (
          <div>
            <ReactCrop
              crop={crop}
              onChange={(newCrop) => setCrop(newCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspect}
            >
              {imageSrc && (
                <img
                  src={imageSrc}
                  onLoad={(e) => {
                    imageRef.current = e.currentTarget as HTMLImageElement;
                  }}
                  className="max-w-full h-auto rounded-md"
                />
              )}
            </ReactCrop>
            <div className="mt-4">
              <canvas
                ref={previewCanvasRef}
                className="w-48 h-48 border border-secondary rounded-md"
              />
            </div>
          </div>
        )}
      </div>
  
      <div className="flex flex-col space-y-3">
        <label className="text-lg font-semibold text-secondary">First Name</label>
        <input
          type="text"
          name="firstName"
          value={profileData.firstName}
          onChange={handleChange}
          className="w-full p-4 bg-dark text-white rounded-lg border border-secondary focus:outline-none focus:ring focus:ring-primary"
          placeholder="Enter your first name"
          required
        />
      </div>
  
      <div className="flex flex-col space-y-3">
        <label className="text-lg font-semibold text-secondary">Last Name</label>
        <input
          type="text"
          name="lastName"
          value={profileData.lastName}
          onChange={handleChange}
          className="w-full p-4 bg-dark text-white rounded-lg border border-secondary focus:outline-none focus:ring focus:ring-primary"
          placeholder="Enter your last name"
          required
        />
      </div>
  
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex flex-col space-y-3">
          <label className="text-lg font-semibold text-secondary">Height</label>
          {heightUnit === "ft" ? (
            <div className="flex items-center space-x-2">
              <input
                type="number"
                name="feet"
                value={feet}
                onChange={(e) => setFeet(e.target.value)}
                className="w-1/2 p-4 bg-dark text-white rounded-lg border border-secondary focus:outline-none focus:ring focus:ring-primary"
                placeholder="Feet"
                min="0"
                required
              />
              <input
                type="number"
                name="inches"
                value={inches}
                onChange={(e) => setInches(e.target.value)}
                className="w-1/2 p-4 bg-dark text-white rounded-lg border border-secondary focus:outline-none focus:ring focus:ring-primary"
                placeholder="Inches"
                min="0"
                max="11"
                required
              />
            </div>
          ) : (
            <input
              type="number"
              step="0.01"
              name="height"
              value={profileData.height}
              onChange={handleChange}
              className="w-full p-4 bg-dark text-white rounded-lg border border-secondary focus:outline-none focus:ring focus:ring-primary"
              placeholder={`Height in ${heightUnit === "cm" ? "centimeters" : "meters"}`}
              required
            />
          )}
          <select
            value={heightUnit}
            onChange={(e) => setHeightUnit(e.target.value as HeightUnit)} // Use type assertion here
            className="p-4 bg-dark text-white rounded-lg border border-secondary focus:outline-none focus:ring focus:ring-primary mt-2"
          >
            <option value="m">Meters (m)</option>
            <option value="cm">Centimeters (cm)</option>
            <option value="ft">Feet & Inches</option>
          </select>
        </div>
  
        <div className="flex flex-col space-y-3">
          <label className="text-lg font-semibold text-secondary">Weight (kg)</label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              name="weight"
              value={profileData.weight}
              onChange={handleChange}
              className="w-full p-4 bg-dark text-white rounded-lg border border-secondary focus:outline-none focus:ring focus:ring-primary"
              placeholder="Weight"
              required
            />
            <select
              value={weightUnit}
              onChange={(e) => setWeightUnit(e.target.value as WeightUnit)} // Type assertion here
              className="p-4 bg-dark text-white rounded-lg border border-secondary focus:outline-none focus:ring focus:ring-primary"
            >
              <option value="kg">Kilograms (kg)</option>
              <option value="lbs">Pounds (lbs)</option>
            </select>
          </div>
        </div>
      </div>
  
      <div className="flex flex-col space-y-3">
        <label className="text-lg font-semibold text-secondary">Birthdate</label>
        <input
          type="date"
          name="birthdate"
          value={profileData.birthdate}
          onChange={handleChange}
          className="w-full p-4 bg-dark text-white rounded-lg border border-secondary focus:outline-none focus:ring focus:ring-primary"
          required
        />
      </div>
  
      <div className="flex flex-col space-y-3">
        <label className="text-lg font-semibold text-secondary">Gender</label>
        <select
          name="gender"
          value={profileData.gender}
          onChange={handleChange}
          className="w-full p-4 bg-dark text-white rounded-lg border border-secondary focus:outline-none focus:ring focus:ring-primary"
          required
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
  
      <button
        type="submit"
        className="w-full bg-primary hover:bg-orange-500 text-white font-bold py-4 rounded-lg transition duration-300 focus:outline-none focus:ring focus:ring-primary"
      >
        Update Profile
      </button>
    </form>
  );  
}