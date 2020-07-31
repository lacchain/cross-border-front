#!/bin/bash

NG_ENVIRONMENT="";
DELETE_ENV="";
EXEC_FUNCT="start";

while (( $# )); do
	case $1 in
		-e | --environment)
			if [[ "$2" == "pre" || "$2" == "PRE" ]]; then
				NG_ENVIRONMENT="pre";
				DELETE_ENV="pro";
			elif [[ "$2" == "pro" || "$2" == "PRO" ]]; then
				NG_ENVIRONMENT="pro";
				DELETE_ENV="pre";
			else
				echo "ENVIRONMENT not valid. Expecting pre or pro, but I received $2" >&2;
				exit 10;
			fi
			shift;
		;;
		start)
			EXEC_FUNCT="start";
		;;
		stop)
			EXEC_FUNCT="stop";
		;;
		reload)
			EXEC_FUNCT="reload";
		;;
		*)
			echo "Param \"$1\" not permited." >&2;
			exit 10;
		;;
	esac;
	shift;
done;

# Checking params:
if ! [[ "$NG_ENVIRONMENT" == "pre" || "$NG_ENVIRONMENT" == "pro" ]]; then
	echo "Environment has not beed specified. Use -e <env> to set it. Valid values are \"pre\" and \"pro\". I have received \"$NG_ENVIRONMENT\"";
	exit 11;
fi
if [[ "$DELETE_ENV" == "" ]]; then
	echo "There were some problem stablishing Environment to be deleted. Valid values are \"pre\" and \"pro\", but I have \"$DELETE_ENV\".";
	exit 11;
fi

# Deleting unused environment:
echo -n "Deleting file frontend.${DELETE_ENV}.conf..."
EXIT_TEXT=`rm -f /etc/nginx/conf.d/frontend.${DELETE_ENV}.conf 2>&1`;
if [[ $? != 0 ]]; then
	echo -e "\tFAIL!!\n\tThere were some problem deling file frontend.${DELETE_ENV}.conf: ${EXIT_TEXT}"
	exit 12;
fi

echo -ne "\tOK!!\nDeleting file api-frontend.${DELETE_ENV}.conf..."
EXIT_TEXT=`rm -f /etc/nginx/conf.d/api-frontend.${DELETE_ENV}.conf 2>&1`;
if [[ $? != 0 ]]; then
	echo -e "\tFAIL!!\n\tThere were some problem deling file api-frontend.${DELETE_ENV}.conf: ${EXIT_TEXT}"
	exit 12;
fi

echo -ne "\tOK!!\nDeleting directory /var/www/${DELETE_ENV}..."
EXIT_TEXT=`rm -fr /var/www/${DELETE_ENV} 2>&1`;
if [[ $? != 0 ]]; then
	echo -e "\tFAIL!!\n\tThere were some problem deling directory /var/www/${DELETE_ENV}: ${EXIT_TEXT}"
	exit 12;
fi
echo -e "\tOK!!\nStarting nginx service:"

# Starting nginx process:
nginx -g 'daemon off;';
echo -e "nginx service has stopped. Exit"
