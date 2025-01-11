'use client';

import { useState } from 'react';
import styles from '../styles/ChurchCreationForm.module.css';

export default function ChurchCreationForm() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        churchName: '',
        denomination: '',
        yearEstablished: '',
        contactName: '',
        email: '',
        phone: '',
        address: '',
        admin: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleNext = () => {
        if (step < 3) {
            setStep(step + 1);
        }
    };

    const handlePrevious = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        try {
            const response = await fetch('/api/churches', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                alert('Church registered successfully!');
                setFormData({
                    churchName: '',
                    denomination: '',
                    yearEstablished: '',
                    contactName: '',
                    email: '',
                    phone: '',
                    address: '',
                    admin: '',
                    password: '',
                    confirmPassword: '',
                    agreeToTerms: false,
                });
                setStep(1); // Reset to first step after submission
            } else {
                alert('Failed to register the church.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred.');
        }
    };

    // Calculate progress (percentage based on current step)
    const progress = (step - 1) * 50; // 3 steps, so each step is 50%

    return (
        <div className={styles.container}>
            <div className={styles.topBar}>
                <h1 className={styles.title}>ServeWell</h1>
            </div>

            <div className={styles.formContainer}>
                <div className={styles.formWrapper}>
                    <form onSubmit={handleSubmit}>
                        {step === 1 && (
                            <div>
                                <h2 className={styles.formTitle}>Church Details</h2>
                                <div className={styles.progressBarContainer}>
                                    <div
                                        className={styles.progressBar}
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <input
                                    type="text"
                                    name="churchName"
                                    placeholder="Church Name"
                                    value={formData.churchName}
                                    onChange={handleChange}
                                    className={styles.input}
                                    required
                                />
                                <input
                                    type="text"
                                    name="denomination"
                                    placeholder="Denomination"
                                    value={formData.denomination}
                                    onChange={handleChange}
                                    className={styles.input}
                                />
                                <input
                                    type="number"
                                    name="yearEstablished"
                                    placeholder="Year Established"
                                    value={formData.yearEstablished}
                                    onChange={handleChange}
                                    className={styles.input}
                                />
                            </div>
                        )}

                        {step === 2 && (
                            <div>
                                <h2 className={styles.formTitle}>Contact Information</h2>
                                <div className={styles.progressBarContainer}>
                                    <div
                                        className={styles.progressBar}
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <input
                                    type="text"
                                    name="contactName"
                                    placeholder="Contact Name"
                                    value={formData.contactName}
                                    onChange={handleChange}
                                    className={styles.input}
                                    required
                                />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={styles.input}
                                    required
                                />
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="Phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className={styles.input}
                                    required
                                />
                                <input
                                    type="text"
                                    name="address"
                                    placeholder="Address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className={styles.input}
                                    required
                                />
                            </div>
                        )}

                        {step === 3 && (
                            <div>
                                <h2 className={styles.formTitle}>Account Settings</h2>
                                <div className={styles.progressBarContainer}>
                                    <div
                                        className={styles.progressBar}
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <input
                                    type="text"
                                    name="admin"
                                    placeholder="Admin Name"
                                    value={formData.admin}
                                    onChange={handleChange}
                                    className={styles.input}
                                    required
                                />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={styles.input}
                                    required
                                />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={styles.input}
                                    required
                                />
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="agreeToTerms"
                                        checked={formData.agreeToTerms}
                                        onChange={handleChange}
                                        className="mr-2"
                                        required
                                    />
                                    <label htmlFor="agreeToTerms" className="text-sm">
                                        I agree to the terms and conditions
                                    </label>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between">
                            {step > 1 && (
                                <button
                                    type="button"
                                    onClick={handlePrevious}
                                    className={styles.button}
                                >
                                    Previous
                                </button>
                            )}
                            {step < 3 ? (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className={styles.button}
                                >
                                    Next
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    className={styles.button}
                                >
                                    Register Church
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
