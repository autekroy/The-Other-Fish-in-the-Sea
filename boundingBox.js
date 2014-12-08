/*

This javascript library is for advanced topic, collision detection.

Main Author: Sergio
*/

function boundingBox()
{
    this.minX = {};
    this.minY = {};
    this.minZ = {};
    this.maxX = {};
    this.maxY = {};
    this.maxZ = {};

    this.isMinXSet = false;
    this.isMinYSet = false;
    this.isMinZSet = false;
    this.isMaxXSet = false;
    this.isMaxYSet = false;
    this.isMaxZSet = false;
};

boundingBox.prototype.isReady = function()
{
    if(this.isMinXSet == false || this.isMinYSet == false || this.isMinZSet == false || this.isMaxXSet == false || this.isMaxYSet == false || this.isMaxZSet == false)
    {
        return false;
    }
    else
    {
        return true;
    }
}

boundingBox.prototype.setminX = function(x)
{
    this.minX.transformed_point = x.transformed_point;
    this.minX.point = x.point;
    this.isMinXSet = true;
};
boundingBox.prototype.setminY = function(y)
{
    this.minY.transformed_point = y.transformed_point;
    this.minY.point = y.point;
    this.isMinYSet = true;
};
boundingBox.prototype.setminZ = function(z)
{
    this.minZ.transformed_point = z.transformed_point;
    this.minZ.point = z.point;
    this.isMinZSet = true;
};
boundingBox.prototype.setmaxX = function(x)
{
    this.maxX.transformed_point = x.transformed_point;
    this.maxX.point = x.point;
    this.isMaxXSet = true;
};
boundingBox.prototype.setmaxY = function(y)
{
    this.maxY.transformed_point = y.transformed_point;
    this.maxY.point = y.point;
    this.isMaxYSet = true;
};
boundingBox.prototype.setmaxZ = function(z)
{
    this.maxZ.transformed_point = z.transformed_point;
    this.maxZ.point = z.point;
    this.isMaxZSet = true;
};

boundingBox.prototype.getminX  = function()
{
    if(this.isMinXSet)
    {
        return this.minX;
    }
    else
    {
        console.log("minX not set yet...");
        return null;
    }
};
boundingBox.prototype.getminY = function()
{
    if(this.isMinYSet)
    {
        return this.minY;
    }
    else
    {
        console.log("minY not set yet...");
        return null;
    }  
};
boundingBox.prototype.getminZ = function()
{
    if(this.isMinZSet)
    {
        return this.minZ;
    }
    else
    {
        console.log("minZ not set yet...");
        return null;
    }
};
boundingBox.prototype.getmaxX = function()
{
    if(this.isMaxXSet)
    {
        return this.maxX;
    }
    else
    {
        console.log("maxX not set yet...");
        return null;
    }    
};
boundingBox.prototype.getmaxY = function()
{
    if(this.isMaxYSet)
    {
        return this.maxY;
    }
    else
    {
        console.log("maxY not set yet...");
        return null;
    } 
};
boundingBox.prototype.getmaxZ = function()
{
    if(this.isMaxZSet)
    {
        return this.maxZ;
    }
    else
    {
        console.log("maxZ not set yet...");
        return null;
    }     
};

boundingBox.prototype.haveCollided = function(B)
{
    if(this.isReady() && B.isReady())
    {
        //if A's maximum X is less than B's minimum x, or B's maximum X is less than A's minimum x, or A's minimum Y is less than B's maximum, or B's minimum y is less than A's greatest y, or A's min z is less than B's max z, or B's min z is less than A's max z
        //AX<Bx||BX<Ax||AY<By||BY<Ay
        var AxB = false;
        var BxA = false;
        var AyB = false;
        var ByA = false;
        var AzB = false;
        var BzA = false;

        AxB = this.maxX.transformed_point < B.getminX().transformed_point;//A's maximum X is less than B's minimum x
        BxA = B.getmaxX().transformed_point < this.minX.transformed_point;//B's maximum X is less than A's minimum x
        AyB = B.getmaxY().transformed_point < this.minY.transformed_point;//A's minimum Y is less than B's maximum y
        ByA = this.maxY.transformed_point < B.getminY().transformed_point;//B's minimum y is less than A's greatest y
        AzB = B.getmaxZ().transformed_point < this.minZ.transformed_point;//A's min z is less than B's max z
        BzA = this.maxZ.transformed_point < B.getminZ().transformed_point;//B's min z is less than A's max z

        if(AxB || BxA || AyB || ByA || AzB || BzA)
        {
            return false;
        }
        else
        {
            return true;
        }
    }
    else
    {
        return false;
    }
}

function matrixPointMultiplication(matrix, point)
{
    var pointMatrix = new Array();
    var result = new Array(matrix.length);
    for(var pointVectorRow = 0; pointVectorRow < point.length; pointVectorRow++)
    {
        var tempArray = [point[pointVectorRow]];
        pointMatrix.push(tempArray);
    }

    var result = new Array(matrix.length);

    for(var matrixRow = 0; matrixRow < matrix.length; matrixRow++)
    {
        result[matrixRow] = new Array(pointMatrix[0].length);
    }


    if(matrix[0].length != pointMatrix.length)
    {
        console.log("the matrix and the point are not good... dimension wise");
        return;
    }
    else
    {
        for(var matrixRow = 0; matrixRow < matrix.length; matrixRow++)
        {
            for(var pointMatrixColumn = 0; pointMatrixColumn < pointMatrix[0].length; pointMatrixColumn++)
            {
                result[matrixRow][pointMatrixColumn] = 0.0;
                for(var matrixColumn = 0; matrixColumn < matrix[0].length; matrixColumn++)
                {
                    result[matrixRow][pointMatrixColumn] += matrix[matrixRow][matrixColumn] * pointMatrix[matrixColumn][pointMatrixColumn];
                }
            }
        }
    }

    return result;
}

function putExtremesInBoundaryObject(arrayOfPoints, ctm, boundaryObject)
{
    var minX = {};
    var minY = {};
    var minZ = {};
    var maxX = {};
    var maxY = {};
    var maxZ = {};

    var firstTime = true;

    for(var i = 0; i < arrayOfPoints.length; i++)
    {
        var current_point = vec4(arrayOfPoints[i][0],arrayOfPoints[i][1],arrayOfPoints[i][2],1.0);
        var transformed_point =  matrixPointMultiplication(ctm, current_point);//mult(current_point, ctm);
        if(firstTime)
        {
            minX.transformed_point = transformed_point[0][0];
            minX.point = current_point[0];
            minY.transformed_point = transformed_point[1][0];
            minY.point = current_point[1];
            minZ.transformed_point = transformed_point[2][0];
            minZ.point = current_point[2];
            maxX.transformed_point = transformed_point[0][0];
            maxX.point = current_point[0];
            maxY.transformed_point = transformed_point[1][0];
            maxY.point = current_point[1];
            maxZ.transformed_point = transformed_point[2][0];
            maxZ.point = current_point[2];

            firstTime = false;
        }
        else
        {
            //look for minX
            if(transformed_point[0] < minX.transformed_point)
            {
                minX.transformed_point = transformed_point[0][0];
                minX.point = current_point[0];
            }
            //look for minY
            if(transformed_point[1] < minY.transformed_point)
            {
                minY.transformed_point = transformed_point[1][0];
                minY.point = current_point[1];
            }
            //look for minZ
            if(transformed_point[2] < minZ.transformed_point)
            {
                minZ.transformed_point = transformed_point[2][0];
                minZ.point = current_point[2];
            }
            //look for maxX
            if(transformed_point[0] > maxX.transformed_point)
            {
                maxX.transformed_point = transformed_point[0][0];
                maxX.point = current_point[0];
            }
            //look for maxY
            if(transformed_point[1] > maxY.transformed_point)
            {
                maxY.transformed_point = transformed_point[1][0];
                maxY.point = current_point[1]; 
            }
            //look for maxZ
            if(transformed_point[2] > maxZ.transformed_point)
            {
                maxZ.transformed_point = transformed_point[2][0];
                maxZ.point = current_point[2];                
            }
        }   
    }

    boundaryObject.setminX(minX);
    boundaryObject.setminY(minY);
    boundaryObject.setminZ(minZ);
    boundaryObject.setmaxX(maxX);
    boundaryObject.setmaxY(maxY);
    boundaryObject.setmaxZ(maxZ);
}

