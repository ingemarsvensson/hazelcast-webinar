package codeset.hazelcast.codegen;

import static org.junit.Assert.assertNotNull;

import org.junit.Test;
import org.mockito.Mockito;

import sungard.hazelcast.codegen.PortableClass;
import sungard.hazelcast.codegen.xmi.XmiModel;

import com.hazelcast.nio.serialization.Portable;
import com.sun.codemodel.JClassAlreadyExistsException;
import com.sun.codemodel.JCodeModel;
import com.sun.codemodel.JDefinedClass;
import com.sun.codemodel.JMod;
import com.sun.codemodel.JType;

public class PortableClassTest {

    @Test
    public void testGenerate() throws JClassAlreadyExistsException {

        XmiModel xmiModel = Mockito.mock(XmiModel.class);

        JCodeModel codeModel = new JCodeModel();
        String basePackage = "codeset.model";

        JDefinedClass portable1 = codeModel._class(basePackage + ".TestPortable1");
        portable1._implements(Portable.class);
        JDefinedClass portable2 = codeModel._class(basePackage + ".TestPortable2");
        portable2._implements(Portable.class);
        JDefinedClass portable3 = codeModel._class(basePackage + ".TestPortable3");
        portable3._implements(Portable.class);

        PortableClass portableClass = new PortableClass(basePackage);
        portableClass.generate(xmiModel, codeModel);

        JDefinedClass result1 = codeModel._getClass(basePackage + ".TestPortable1");
        JDefinedClass result2 = codeModel._getClass(basePackage + ".TestPortable2");
        JDefinedClass result3 = codeModel._getClass(basePackage + ".TestPortable3");

        assertNotNull(result1);
        assertNotNull(result2);
        assertNotNull(result3);

    }

}
