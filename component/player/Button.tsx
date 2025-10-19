import styles from './Button.module.css';

import { IconType } from "react-icons";

interface Props {
    title: string;
    Icon: IconType;
    className?: string;
    action: () => void;
}

export default function Button({ title, Icon, action, className }: Props) {
    return (
        <div
            title={title}
            onClick={action}
            className={`${styles.wrapper} ${className ? styles[className] : ''}`}
        >
            <Icon />
        </div>
    )
}