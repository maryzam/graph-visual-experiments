
const onSegment = (segment, checkedPoint) => {
	 return (checkedPoint.x <= Math.max(segment.source.x, segment.target.x)) &&
	 		(checkedPoint.x >= Math.min(segment.source.x, segment.target.x)) && 
	        (checkedPoint.y <= Math.max(segment.source.y, segment.target.y)) &&
	        (checkedPoint.y >= Math.min(segment.source.y, segment.target.y));
}

const getOrientation = (first, second, third) => {
	const orientation =(second.y - first.y) * (third.x - second.x) - (second.x - first.x) * (third.y - second.y); 
  
  	return orientation == 0 ?
  				0: // collinear
  				orientation > 0 ?
	  				1: // clockwise
	  				-1; // counterclockwise
}

const isIntersect = (first, second, checkSpecialCases = false) => {

	const orientation1 = getOrientation(first.source, first.target, second.source); 
    const orientation2 = getOrientation(first.source, first.target, second.target); 
    const orientation3 = getOrientation(second.source, second.target, first.source); 
    const orientation4 = getOrientation(second.source, second.target, first.target); 
  
    // General case 
    if (orientation1 != orientation2 && orientation3 != orientation4) return true; 

    // Special Cases 
    // first segment and vector second.source are colinear and point second.source lies on first segment 
    if (orientation1 == 0 && onSegment(first, second.source)) return true; 
  
    // first segment and vector second.target are colinear and point second.target lies on first segment 
    if (orientation2 == 0 && onSegment(first, second.target)) return true; 
  
    // second segment and vector first.source are colinear and point first.source lies on second segment 
    if (orientation3 == 0 && onSegment(second, first.source)) return true; 
  
     // second segment and vector first.target are colinear and point first.target lies on second segment 
    if (orientation4 == 0 && onSegment(second, first.target)) return true; 
  
    return false;
}