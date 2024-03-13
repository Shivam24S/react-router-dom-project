import {
  useNavigate,
  Form,
  useNavigation,
  useActionData,
  json,
  redirect,
} from "react-router-dom";

import classes from "./EventForm.module.css";

function EventForm({ method, event }) {
  const navigate = useNavigate();

  const navigation = useNavigation();

  function cancelHandler() {
    navigate("..");
  }
  // ui transition
  const isSubmitting = navigation.state === "submitting";

  // validating Input

  const actionData = useActionData();

  return (
    <Form method={method} className={classes.form}>
      {actionData && actionData.errors && (
        <ul>
          {Object.values(actionData.errors).map((err) => (
            <li key={err}>{err}</li>
          ))}
        </ul>
      )}
      <p>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          required
          defaultValue={event ? event.title : ""}
        />
      </p>
      <p>
        <label htmlFor="image">Image</label>
        <input
          id="image"
          type="url"
          name="image"
          required
          defaultValue={event ? event.image : ""}
        />
      </p>
      <p>
        <label htmlFor="date">Date</label>
        <input
          id="date"
          type="date"
          name="date"
          required
          defaultValue={event ? event.date : ""}
        />
      </p>
      <p>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          rows="5"
          required
          defaultValue={event ? event.description : ""}
        />
      </p>
      <div className={classes.actions}>
        <button type="button" onClick={cancelHandler} disabled={isSubmitting}>
          Cancel
        </button>
        <button disabled={isSubmitting}>
          {isSubmitting ? "Submitting" : "Save"}
        </button>
      </div>
    </Form>
  );
}

export default EventForm;

export async function FormDataSenderAndUpdater({ request, params }) {
  const data = await request.formData();

  const method = request.method;

  const allData = {
    title: data.get("title"),
    image: data.get("image"),
    date: data.get("date"),
    description: data.get("description"),
  };

  let url = "http://localhost:8080/events";

  if (method === "PATCH") {
    const id = params.eventId;
    url = "http://localhost:8080/events/" + id;
  }

  const response = await fetch(url, {
    method: method,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(allData),
  });

  if (response.status === 422) {
    return response;
  }
  if (!response.ok) {
    throw json({ message: "can't able to save event Data" }, { status: 500 });
  }
  return redirect("/events");
}
