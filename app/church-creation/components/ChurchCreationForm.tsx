'use client';

import { useState } from 'react';
import styles from '../styles/ChurchCreationForm.module.css';

export default function ChurchCreationForm() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        churchName: '',
        denomination: '',
        email: '',
        phone: '',
        address: '',
        postalCode: '',
        city: '',
        state: '',
        admin: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
    
        if (e.target.type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement; // Type assertion for checkbox
            setFormData({
                ...formData,
                [name]: checked,
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
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
                    email: '',
                    phone: '',
                    address: '',
                    postalCode: '',
                    city: '',
                    state: '',
                    admin: '',
                    password: '',
                    confirmPassword: '',
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
                                <input
                                    type="text"
                                    name="postalCode"
                                    placeholder="Postal Code"
                                    value={formData.postalCode}
                                    onChange={handleChange}
                                    className={styles.input}
                                    required
                                />
                                <input
                                    type="text"
                                    name="city"
                                    placeholder="City"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className={styles.input}
                                    required
                                />
                                <select
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                className={styles.input}
                                required
                            >
                                <option value="" disabled>
                                    Select State
                                </option>
                                <option value="AL">Alabama</option>
                                <option value="AK">Alaska</option>
                                <option value="AZ">Arizona</option>
                                <option value="AR">Arkansas</option>
                                <option value="CA">California</option>
                                <option value="CO">Colorado</option>
                                <option value="CT">Connecticut</option>
                                <option value="DE">Delaware</option>
                                <option value="FL">Florida</option>
                                <option value="GA">Georgia</option>
                                <option value="HI">Hawaii</option>
                                <option value="ID">Idaho</option>
                                <option value="IL">Illinois</option>
                                <option value="IN">Indiana</option>
                                <option value="IA">Iowa</option>
                                <option value="KS">Kansas</option>
                                <option value="KY">Kentucky</option>
                                <option value="LA">Louisiana</option>
                                <option value="ME">Maine</option>
                                <option value="MD">Maryland</option>
                                <option value="MA">Massachusetts</option>
                                <option value="MI">Michigan</option>
                                <option value="MN">Minnesota</option>
                                <option value="MS">Mississippi</option>
                                <option value="MO">Missouri</option>
                                <option value="MT">Montana</option>
                                <option value="NE">Nebraska</option>
                                <option value="NV">Nevada</option>
                                <option value="NH">New Hampshire</option>
                                <option value="NJ">New Jersey</option>
                                <option value="NM">New Mexico</option>
                                <option value="NY">New York</option>
                                <option value="NC">North Carolina</option>
                                <option value="ND">North Dakota</option>
                                <option value="OH">Ohio</option>
                                <option value="OK">Oklahoma</option>
                                <option value="OR">Oregon</option>
                                <option value="PA">Pennsylvania</option>
                                <option value="RI">Rhode Island</option>
                                <option value="SC">South Carolina</option>
                                <option value="SD">South Dakota</option>
                                <option value="TN">Tennessee</option>
                                <option value="TX">Texas</option>
                                <option value="UT">Utah</option>
                                <option value="VT">Vermont</option>
                                <option value="VA">Virginia</option>
                                <option value="WA">Washington</option>
                                <option value="WV">West Virginia</option>
                                <option value="WI">Wisconsin</option>
                                <option value="WY">Wyoming</option>
                            </select>

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

                    {/* Move the "Back to Home" link inside the form container */}
                    <div className="mt-4 text-center">
                        <a href="/" className="text-blue-500 hover:underline">Back to Home</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
