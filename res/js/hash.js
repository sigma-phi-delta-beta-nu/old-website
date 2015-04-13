function hashCode(string) {
	
	var hash = 0;
	var strlen = string.length;
	var tempChar;
	
	if (strlen === 0) {
	
		return hash;
	
	}
	
	for(var i = 0; i < strlen; i++) {
	
		tempChar = string.charCodeAt(i);
		hash = ((hash << 5) - hash) + tempChar;
		hash &= hash;
	
	}
	
	return hash;
	
}
