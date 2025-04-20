import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import zxcvbn from "zxcvbn";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEnvelope,
    faLock,
    faEye,
    faEyeSlash,
    faUserPlus,
    faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import AOS from "aos";
import "aos/dist/aos.css";
import "tailwindcss/tailwind.css";

const passwordSchema = z
    .string()
    .min(6, { message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" })
    .refine(
        (value) =>
            (value.match(/[!@#$%^&*()_+{}[\]:;<>,.?~]/g) || []).length >= 2,
        {
            message: "รหัสผ่านต้องมีอักขระพิเศษอย่างน้อย 2 ตัว (!@#$%^&*)",
        }
    );

const schema = z
    .object({
        email: z.string().email({ message: "กรุณากรอกอีเมลที่ถูกต้อง" }),
        password: passwordSchema,
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "รหัสผ่านไม่ตรงกัน",
        path: ["confirmPassword"],
    });

const Register = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(schema),
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const recaptchaRef = useRef(null);

    useEffect(() => {
        AOS.init({ duration: 800, easing: "ease-in-out", once: true });
    }, []);

    const onSubmit = async (data) => {
        const recaptchaValue = recaptchaRef.current?.getValue();
        if (!recaptchaValue) {
            Swal.fire("โปรดยืนยันว่าไม่ใช่บอท", "", "warning");
            return;
        }

        try {
            await axios.post("https://shop-main-api.vercel.app/api/register", {
                ...data,
                recaptcha: recaptchaValue,
            });

            Swal.fire({
                title: "สมัครสมาชิกสำเร็จ!",
                text: "ยินดีต้อนรับเข้าสู่ระบบ",
                icon: "success",
                timer: 2000,
                showConfirmButton: false,
            });
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err) {
            Swal.fire(
                "เกิดข้อผิดพลาด!",
                err.response?.data?.message || "ลองใหม่อีกครั้ง",
                "error"
            );
        }
    };

    const handlePasswordChange = (e) => {
        const passwordValue = e.target.value;
        setValue("password", passwordValue);
        setPasswordStrength(passwordValue ? zxcvbn(passwordValue).score : -1);
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a]"
            data-theme="black"
        >
            <div
                className="card w-full max-w-md bg-base-200 shadow-2xl"
                data-aos="fade-up"
            >
                <div className="card-body">
                    <h2 className="text-2xl font-bold text-center mb-4 text-white">
                        <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
                        สมัครสมาชิก
                    </h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Email */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-white">อีเมล</span>
                            </label>
                            <input
                                type="email"
                                placeholder="อีเมลของคุณ"
                                {...register("email")}
                                className="input input-bordered bg-white/10 text-white placeholder-white/60"
                            />
                            {errors.email && (
                                <p className="text-red-400 text-sm mt-1">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-white">รหัสผ่าน</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="รหัสผ่าน"
                                    {...register("password")}
                                    onChange={handlePasswordChange}
                                    className="input input-bordered w-full pr-10 bg-white/10 text-white placeholder-white/60"
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-2.5 text-white/60"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                </button>
                            </div>
                            {/* Password Strength */}
                            {watch("password") && (
                                <progress
                                    className={`progress mt-2 ${
                                        passwordStrength <= 1
                                            ? "progress-error"
                                            : passwordStrength === 2
                                                ? "progress-warning"
                                                : "progress-success"
                                    }`}
                                    value={(passwordStrength + 1) * 20}
                                    max="100"
                                />
                            )}
                            {errors.password && (
                                <p className="text-red-400 text-sm mt-1">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-white">ยืนยันรหัสผ่าน</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="ยืนยันรหัสผ่าน"
                                    {...register("confirmPassword")}
                                    className="input input-bordered w-full pr-10 bg-white/10 text-white placeholder-white/60"
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-2.5 text-white/60"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    <FontAwesomeIcon
                                        icon={showConfirmPassword ? faEyeSlash : faEye}
                                    />
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-red-400 text-sm mt-1">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>

                        {/* Recaptcha */}
                        <div className="flex justify-center">
                            <ReCAPTCHA
                                ref={recaptchaRef}
                                sitekey="6LfkIeAqAAAAAPfJ9mnmWYR4-OSct2m_2qAwheSt"
                            />
                        </div>

                        {/* Submit */}
                        <div className="form-control mt-4">
                            <button
                                type="submit"
                                className="btn btn-success gap-2 text-white"
                                disabled={isSubmitting}
                            >
                                <FontAwesomeIcon icon={faCheckCircle} />
                                {isSubmitting ? "กำลังสมัคร..." : "สมัครสมาชิก"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
