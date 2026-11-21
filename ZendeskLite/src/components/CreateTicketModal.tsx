
import { useState } from "react";
import { X } from "lucide-react";
import type { Ticket } from "../data/tickets";
import "./CreateTicketModal.css";

interface CreateTicketModalProps {
    onClose: () => void;
    onCreate: (data: {
        title: string;
        description: string;
        priority: Ticket["priority"];
    }) => void;
}

export default function CreateTicketModal({
                                              onClose,
                                              onCreate,
                                          }: CreateTicketModalProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] =
        useState<Ticket["priority"]>("Medium");

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!title.trim() || !description.trim()) return;

        onCreate({
            title: title.trim(),
            description: description.trim(),
            priority,
        });
    };

    return (
        <div
            className="modal-overlay"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <div
                className="create-ticket-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="create-ticket-title"
            >
                <div className="modal-header">
                    <div>
                        <span className="modal-eyebrow">NEW REQUEST</span>
                        <h2 id="create-ticket-title">Create a ticket</h2>
                        <p>Add the details of the support request.</p>
                    </div>

                    <button
                        className="modal-close"
                        onClick={onClose}
                        aria-label="Close modal"
                        type="button"
                    >
                        <X size={19} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-field">
                        <label htmlFor="ticket-title">Ticket title</label>
                        <input
                            id="ticket-title"
                            type="text"
                            placeholder="e.g. Unable to login to account"
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="ticket-description">Description</label>
                        <textarea
                            id="ticket-description"
                            placeholder="Describe the issue in detail..."
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                            rows={4}
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="ticket-priority">Priority</label>
                        <select
                            id="ticket-priority"
                            value={priority}
                            onChange={(event) =>
                                setPriority(event.target.value as Ticket["priority"])
                            }
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Urgent">Urgent</option>
                        </select>
                    </div>

                    <div className="modal-footer">
                        <button
                            type="button"
                            className="secondary-button"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button type="submit" className="modal-submit">
                            Create ticket
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
