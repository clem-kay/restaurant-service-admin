"use client";
import React, {useState} from "react";
import {Label} from "./label";
import {Input} from "./input";
import {cn} from "@/lib/utils";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";
import useLogin from "@/hooks/auth/useLogin.tsx";
import {Triangle} from "react-loader-spinner";
import {useLocation} from "react-router-dom";
import useRegisterUserAccount, {
    RegisterUserAccountData
} from "@/hooks/userAccount/useRegisterUserAccount.ts";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,} from "@/components/ui/command";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {Check, ChevronsUpDown} from "lucide-react";
import {ROLE} from "@/constants/constants.ts";

// Validation schema
const formSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    password: z.string().min(4, {
        message: "Password must be at least 4 characters.",
    }),
    role: z.enum(["PLATFORM_ADMIN", "RESTAURANT_ADMIN", "RESTAURANT_STAFF", "CUSTOMER", "RIDER", "SUPERADMIN", "ADMIN", "USER", "SALES"]).optional(),
});

// Role options
const roleOptions = [
    {value: "SUPERADMIN", label: "Super Admin"},
    {value: "ADMIN", label: "Admin"},
    {value: "USER", label: "User"},
    {value: "SALES", label: "Sales"},
];

export const Auth = () => {
    const path = useLocation().pathname.split("/")[2];
    const {mutate: mutateLogin, isPending} = useLogin();
    const {mutate: mutateUserAccount} = useRegisterUserAccount();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: ""
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        if (path === "register") {
            mutateUserAccount(values as RegisterUserAccountData);
        } else {
            mutateLogin(values);
        }
    };

    // Combobox state
    const [open, setOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState("USER");

    return (
        <>
            {isPending && (
                <div className="absolute inset-0 flex items-center justify-center z-[1000] bg-white bg-opacity-50">
                    <Triangle visible={true} height="120" width="150" color="green" ariaLabel="triangle-loading"/>
                </div>
            )}
            <div
                className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 mb-8 shadow-input border-[0.1rem] border-border bg-border">
                <h2 className="font-bold text-xl">Welcome</h2>
                <p className="text-sm max-w-sm mt-2">{path === "register" ? "Register" : "Login"}</p>

                <form onSubmit={form.handleSubmit(onSubmit)} className="my-8">
                    <LabelInputContainer className="mb-4">
                        <Label htmlFor="username">Username</Label>
                        <Input id="username" placeholder="username" {...form.register("username")} />
                        {form.formState.errors.username &&
                            <p className="text-destructive">{form.formState.errors.username.message}</p>}
                    </LabelInputContainer>

                    {/* Combobox for Role */}

                    { path === "register" ?
                        (

                        <LabelInputContainer className="mb-4">
                            <Label htmlFor="role">Role</Label>
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={open}
                                        className=" w-full justify-between"
                                    >
                                        {selectedRole
                                            ? roleOptions.find((role) => role.value === selectedRole)?.label
                                            : "Select role..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-0">
                                    <Command>
                                        <CommandInput placeholder="Search role..."/>
                                        <CommandList>
                                            <CommandEmpty>No role found.</CommandEmpty>
                                            <CommandGroup>
                                                {roleOptions.map((role) => (
                                                    <CommandItem
                                                        key={role.value}
                                                        value={role.value}
                                                        onSelect={(currentValue: string) => {
                                                            setSelectedRole(currentValue === selectedRole ? "" : currentValue);
                                                            setOpen(false);
                                                            form.setValue("role", currentValue as ROLE); // Set role value in form
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn("mr-2 h-4 w-4", selectedRole === role.value ? "opacity-100" : "opacity-0")}/>
                                                        {role.label}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            {form.formState.errors.role &&
                                <p className="text-destructive">{form.formState.errors.role.message}</p>}
                        </LabelInputContainer>

                        ): null
                    }

                    {/* Password */}
                    <LabelInputContainer className="mb-4">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" placeholder="••••••••••" type="password" {...form.register("password")} />
                        {form.formState.errors.password &&
                            <p className="text-destructive">{form.formState.errors.password.message}</p>}
                    </LabelInputContainer>

                    <button
                        className="bg-gradient-to-br relative group/btn bg-primary block w-full text-white rounded-md h-10 font-medium shadow"
                        type="submit">
                        {path === "register" ? "Register" : "Login"} &rarr;
                        <BottomGradient/>
                    </button>
                </form>

                <div
                    className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full"/>

                <div className="flex flex-col space-y-4">
                    <BottomGradient/>
                </div>
            </div>
        </>
    );
};

const BottomGradient = () => {
    return (
        <>
            <span
                className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"/>
            <span
                className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"/>
        </>
    );
};

const LabelInputContainer = ({
                                 children,
                                 className,
                             }: {
    children: React.ReactNode;
    className?: string;
}) => {
    return <div className={cn("flex flex-col space-y-2 w-full", className)}>{children}</div>;
};
