import { Head } from '@inertiajs/react';
import TextLink from '@/components/text-link';
import { login } from '@/routes';

export default function Register() {
    return (
        <>
            <Head title="Registration Disabled" />
            <div className="flex flex-col items-center justify-center text-center gap-4 py-8">
                <h2 className="text-lg font-semibold text-white">Registration is currently disabled</h2>
                <p className="text-sm text-slate-400">
                    We are currently not accepting new accounts. 
                    If you already have an account, you can sign in below.
                </p>
                <div className="mt-4 text-sm text-muted-foreground">
                    <TextLink href={login()}>
                        Log in
                    </TextLink>
                </div>
            </div>
        </>
    );
}

Register.layout = {
    title: 'Registration Disabled',
    description: 'We are currently not accepting new accounts',
};
