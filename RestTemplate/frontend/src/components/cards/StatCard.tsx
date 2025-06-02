import { Link } from "react-router-dom"
import { ReactNode } from "react"

interface StatsCardProps {
    title: string
    value: string | number
    link: string
    icon?: ReactNode
    subtitle?: string
    trend?: {
        value: number
        label: string
        isPositive?: boolean
    }
    color?: 'blue' | 'green' | 'purple' | 'red' | 'yellow' | 'indigo' | 'pink' | 'gray'
    size?: 'sm' | 'md' | 'lg'
    variant?: 'default' | 'gradient' | 'minimal' | 'bordered'
    linkText?: string
    showLink?: boolean
}

const StatsCard = ({ 
    title, 
    value, 
    link, 
    icon,
    subtitle,
    trend,
    color = 'blue',
    size = 'md',
    variant = 'default',
    linkText = 'View more',
    showLink = true
}: StatsCardProps) => {
    // Size variants
    const sizeClasses = {
        sm: 'p-4 gap-y-2',
        md: 'p-6 gap-y-3',
        lg: 'p-8 gap-y-4'
    }

    const titleSizes = {
        sm: 'text-base',
        md: 'text-lg',
        lg: 'text-xl'
    }

    const valueSizes = {
        sm: 'text-2xl',
        md: 'text-4xl',
        lg: 'text-5xl'
    }

    // Color variants
    const colorClasses = {
        blue: {
            icon: 'text-blue-500',
            link: 'text-blue-600 hover:text-blue-700',
            accent: 'border-blue-200 bg-blue-50/50',
            gradient: 'from-blue-500 to-blue-600'
        },
        green: {
            icon: 'text-green-500',
            link: 'text-green-600 hover:text-green-700',
            accent: 'border-green-200 bg-green-50/50',
            gradient: 'from-green-500 to-green-600'
        },
        purple: {
            icon: 'text-purple-500',
            link: 'text-purple-600 hover:text-purple-700',
            accent: 'border-purple-200 bg-purple-50/50',
            gradient: 'from-purple-500 to-purple-600'
        },
        red: {
            icon: 'text-red-500',
            link: 'text-red-600 hover:text-red-700',
            accent: 'border-red-200 bg-red-50/50',
            gradient: 'from-red-500 to-red-600'
        },
        yellow: {
            icon: 'text-yellow-500',
            link: 'text-yellow-600 hover:text-yellow-700',
            accent: 'border-yellow-200 bg-yellow-50/50',
            gradient: 'from-yellow-500 to-yellow-600'
        },
        indigo: {
            icon: 'text-indigo-500',
            link: 'text-indigo-600 hover:text-indigo-700',
            accent: 'border-indigo-200 bg-indigo-50/50',
            gradient: 'from-indigo-500 to-indigo-600'
        },
        pink: {
            icon: 'text-pink-500',
            link: 'text-pink-600 hover:text-pink-700',
            accent: 'border-pink-200 bg-pink-50/50',
            gradient: 'from-pink-500 to-pink-600'
        },
        gray: {
            icon: 'text-gray-500',
            link: 'text-gray-600 hover:text-gray-700',
            accent: 'border-gray-200 bg-gray-50/50',
            gradient: 'from-gray-500 to-gray-600'
        }
    }

    // Variant styles
    const getVariantClasses = () => {
        const baseClasses = `w-full ${sizeClasses[size]} flex flex-col items-center rounded-xl transition-all duration-300 hover:scale-105`
        
        switch (variant) {
            case 'gradient':
                return `${baseClasses} bg-gradient-to-br ${colorClasses[color].gradient} text-white shadow-lg hover:shadow-xl`
            case 'minimal':
                return `${baseClasses} bg-white hover:bg-gray-50 border-0 shadow-sm hover:shadow-md`
            case 'bordered':
                return `${baseClasses} bg-white border-2 ${colorClasses[color].accent} shadow-sm hover:shadow-lg`
            default:
                return `${baseClasses} bg-white shadow-lg hover:shadow-xl border border-gray-200`
        }
    }

    const getTrendColor = (isPositive: boolean) => {
        return isPositive ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
    }

    const getTextColor = () => {
        return variant === 'gradient' ? 'text-white' : 'text-gray-900'
    }

    const getLinkColor = () => {
        return variant === 'gradient' ? 'text-white hover:text-gray-200' : colorClasses[color].link
    }

    return (
        <div className={getVariantClasses()}>
            {/* Icon */}
            {icon && (
                <div className={`mb-2 ${variant === 'gradient' ? 'text-white' : colorClasses[color].icon}`}>
                    {icon}
                </div>
            )}

            {/* Title */}
            <h3 className={`${titleSizes[size]} font-semibold text-center ${getTextColor()}`}>
                {title}
            </h3>

            {/* Value */}
            <p className={`${valueSizes[size]} font-bold ${getTextColor()}`}>
                {typeof value === 'number' ? value.toLocaleString() : value}
            </p>

            {/* Subtitle */}
            {subtitle && (
                <p className={`text-sm ${variant === 'gradient' ? 'text-white/80' : 'text-gray-600'} text-center`}>
                    {subtitle}
                </p>
            )}

            {/* Trend */}
            {trend && (
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    variant === 'gradient' 
                        ? 'bg-white/20 text-white' 
                        : getTrendColor(trend.isPositive ?? true)
                }`}>
                    <span>{trend.isPositive !== false ? '↗' : '↘'}</span>
                    <span>{Math.abs(trend.value)}% {trend.label}</span>
                </div>
            )}

            {/* Link */}
            {showLink && (
                <Link 
                    to={link} 
                    className={`font-medium hover:underline transition-colors duration-200 ${getLinkColor()}`}
                >
                    {linkText} &rarr;
                </Link>
            )}
        </div>
    )
}

export default StatsCard 