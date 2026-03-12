import { ActionFunctionArgs } from 'react-router';
import { login } from '../services/auth';

export async function loginAction({ request }: ActionFunctionArgs) {
    const formData = await request.formData();

    const email = String(formData.get('email') ?? '');
    const password = String(formData.get('password') ?? '');

    const data = await login({ email, password });

    return data;
}
