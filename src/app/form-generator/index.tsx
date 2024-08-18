"use client";
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from '@/components/ui/textarea';

import { generateForm } from '../actions/generateForm';
import { useFormState, useFormStatus } from 'react-dom';

import { useSession, signIn} from 'next-auth/react';
import { redirect} from "next/navigation";

type Props = {};

interface FormState {
  message: string;
  data?: any;
}

const initialState: FormState = {
  message: "",
};

export function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Generating..." : "Generate"}
    </Button>
  );
}

const FormGenerator = (props: Props) => {
  const [state, formAction] = useFormState(generateForm, initialState);
  const [open, setOpen] = useState(false);
  const session = useSession();
  console.log(session);

  useEffect(() => {
    if (state.message === "success") {
      setOpen(false);
      redirect(`/forms/edit/` + state.data.id);
    }
    console.log(state);
  }, [state.message]);

  const onFormCreate = () => {
    if (session.data?.user) {
      setOpen(true);
    } else {
      signIn();
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Button onClick={onFormCreate}>Create Form</Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Create New Form</DialogTitle>
          </DialogHeader>
          <form action={formAction}>
            <div className='grid gap-4 py-4'>
              <Textarea
                id="description"
                name="description"
                required
                placeholder={`Share what your form is about, who is it for, and what information you would like to collect. And AI will do the magic for you.`}
              />
            </div>
            <DialogFooter>
              <SubmitButton />
              <Button variant="Link">Create Manually</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FormGenerator;
