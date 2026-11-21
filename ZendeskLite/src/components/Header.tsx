
import { Ticket, ChevronDown } from "lucide-react";
import "./Header.css";

export default function Header() {
    return (
        <header className="app-header">
            <div className="header-inner">
                <div className="header-brand">
                    <div className="brand-icon">
                        <Ticket size={21} strokeWidth={2.2} />
                    </div>
                    <span className="brand-name">Zendesk Lite</span>
                </div>

                <button className="profile-button">
                    <div className="profile-avatar">A</div>

                    <div className="profile-info">
                        <span className="profile-name">Alex Morgan</span>
                        <span className="profile-role">Support Admin</span>
                    </div>

                    <ChevronDown size={16} className="profile-chevron" />
                </button>
            </div>
        </header>
    );
}
