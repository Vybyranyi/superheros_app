import styles from '@pages/FormPage/FormPage.module.scss';
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Input from '@components/Input/Input';
import Button from '@components/Button/Button';
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { createSuperhero } from "@store/SuperheroSlice";
import { useState } from "react";
import FileInput from '@components/FileInput/FileInput';

export default function FormPage() {
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector(state => state.superheros);

    const [files, setFiles] = useState<File[]>([]);

    const initialValues = {
        nickname: '',
        real_name: '',
        origin_description: '',
        superpowers: '',
        catch_phrase: '',
    };

    const validationSchema = Yup.object({
        nickname: Yup.string()
            .min(2, 'Nickname must be at least 2 characters')
            .required('Required'),
        real_name: Yup.string()
            .min(2, 'Real name must be at least 2 characters')
            .required('Required'),
        origin_description: Yup.string()
            .min(10, 'Origin description must be at least 10 characters')
            .required('Required'),
        superpowers: Yup.string()
            .min(1, 'At least one superpower is required')
            .required('Required'),
        catch_phrase: Yup.string()
            .min(5, 'Catch phrase must be at least 5 characters')
            .required('Required'),
    });

    return (
        <div className={styles.formPage}>
            <h1>Create Superhero</h1>
            <div className={styles.formContent}>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={async (values, { resetForm }) => {
                        const payload = {
                            nickname: values.nickname,
                            real_name: values.real_name,
                            origin_description: values.origin_description,
                            superpowers: values.superpowers.split(',').map(s => s.trim()),
                            catch_phrase: values.catch_phrase,
                            images: files,
                        };

                        await dispatch(createSuperhero(payload));
                        resetForm();
                        setFiles([]);
                    }}
                >
                    {({ values, errors, touched, handleChange, handleBlur, isValid, dirty }) => (
                        <Form>
                            <div className={styles.inputsContainer}>
                                <Input
                                    label="Nickname"
                                    placeholder="Enter superhero nickname"
                                    value={values.nickname}
                                    onChange={handleChange('nickname')}
                                    onBlur={handleBlur("nickname")}
                                    error={touched.nickname ? errors.nickname : ""}
                                />
                                <Input
                                    label="Real Name"
                                    placeholder="Enter superhero real name"
                                    value={values.real_name}
                                    onChange={handleChange('real_name')}
                                    onBlur={handleBlur("real_name")}
                                    error={touched.real_name ? errors.real_name : ""}
                                />
                                <Input
                                    label="Origin Description"
                                    placeholder="Enter superhero origin description"
                                    value={values.origin_description}
                                    onChange={handleChange('origin_description')}
                                    onBlur={handleBlur("origin_description")}
                                    error={touched.origin_description ? errors.origin_description : ""}
                                />
                                <Input
                                    label="Superpowers"
                                    placeholder="e.g. flight, strength, x-ray vision"
                                    value={values.superpowers}
                                    onChange={handleChange('superpowers')}
                                    onBlur={handleBlur("superpowers")}
                                    error={touched.superpowers ? errors.superpowers : ""}
                                />
                                <Input
                                    label="Catch Phrase"
                                    placeholder="Enter superhero catch phrase"
                                    value={values.catch_phrase}
                                    onChange={handleChange('catch_phrase')}
                                    onBlur={handleBlur("catch_phrase")}
                                    error={touched.catch_phrase ? errors.catch_phrase : ""}
                                />
                                <FileInput files={files} setFiles={setFiles} label="Images" />
                            </div>

                            {error && (
                                <h5 className={styles.serverError}>{error}</h5>
                            )}

                            <div className={styles.buttonContainer}>
                                <Button
                                    type="submit"
                                    disabled={!(isValid && dirty) || loading}
                                >
                                    {loading ? "Loading..." : "Create"}
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}
