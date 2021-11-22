import { useEffect, useState } from 'react';

export default function useForm(initial = {}) {
	// create a state object for our inputs

	const [inputs, setInputs] = useState(initial);

	const initialValues = Object.values(initial).join('');

	useEffect(() => {
		// This function runs when the things that we are watching change
		setInputs(initial);
	}, [initialValues]);

	function handleChange(e) {
		let { value, name, type } = e.target;
		if (type === 'number') {
			value = parseInt(value);
		}
		if (type === 'file') {
			[value] = e.target.files;
		}

		setInputs({
			...inputs, // copy existing state
			[name]: value,
		});
	}

	function resetForm() {
		setInputs(initial);
	}

	function clearForm() {
		const blankState = Object.fromEntries(
			Object.entries(inputs).map(([key]) => [key, ''])
		);
		setInputs(blankState);
	}

	// return the things we want to surface from the custom hook

	return { inputs, handleChange, resetForm, clearForm };
}
